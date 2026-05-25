import { useEffect, useMemo, useState } from "react";
import { YKeyValue } from "y-utility/y-keyvalue";
import * as Y from "yjs";
import {
  computed,
  createPresenceStateDerivation,
  createTLStore,
  transact,
  react,
  defaultShapeUtils,
  InstancePresenceRecordType,
} from "tldraw";
import { userColor } from "../utils/userColor";

export function useYjsStore({ yDoc, provider, username }) {
  // Get multiplayer store
  const yStore = useMemo(() => {
    if (!yDoc) return null;
    const yArr = yDoc.getArray("tl_records");
    return new YKeyValue(yArr);
  }, [yDoc]);

  // Set up tldraw store and status
  const [store] = useState(() => {
    return createTLStore({
      shapeUtils: [...defaultShapeUtils],
    });
  });

  const [storeWithStatus, setStoreWithStatus] = useState({
    status: "loading",
  });

  useEffect(() => {
    if (!yDoc || !provider || !yStore || !username) return;

    setStoreWithStatus({ status: "loading" });

    const unsubs = [];

    function handleSync() {
      // === DOCUMENT ==========================================================

      // Initialize tldraw with Yjs doc records, or if Yjs empty,
      // initialize the Yjs with the default store records
      if (yStore.yarray.length) {
        // Replace the tldraw records with the Yjs records
        transact(() => {
          store.clear();
          const records = yStore.yarray.toJSON().map(({ val }) => val);
          store.put(records);
        });
      } else {
        // Create the initial store records and sync to Yjs
        yDoc.transact(() => {
          for (const record of store.allRecords()) {
            yStore.set(record.id, record);
          }
        });
      }

      // Sync tldraw changes with Yjs
      unsubs.push(
        store.listen(
          function syncStoreChangesToYjsDoc({ changes }) {
            yDoc.transact(() => {
              Object.values(changes.added).forEach((record) => {
                yStore.set(record.id, record);
              });

              Object.values(changes.updated).forEach(([_, record]) => {
                yStore.set(record.id, record);
              });

              Object.values(changes.removed).forEach((record) => {
                yStore.delete(record.id);
              });
            });
          },
          { source: "user", scope: "document" } // only sync user's document changes
        )
      );

      // Sync Yjs changes with tldraw
      const handleChange = (changes, transaction) => {
        if (transaction.local) return;

        const toRemove = [];
        const toPut = [];

        changes.forEach((change, id) => {
          switch (change.action) {
            case "add":
            case "update": {
              const record = yStore.get(id);
              if (record) toPut.push(record);
              break;
            }
            case "delete": {
              toRemove.push(id);
              break;
            }
          }
        });

        // Update tldraw with changes
        store.mergeRemoteChanges(() => {
          if (toRemove.length) {
            store.remove(toRemove);
          }
          if (toPut.length) {
            store.put(toPut);
          }
        });
      };

      yStore.on("change", handleChange);
      unsubs.push(() => yStore.off("change", handleChange));

      // === PRESENCE ==========================================================

      // Set user's info
      const userPreferences = computed("userPreferences", () => {
        return {
          id: username,
          color: userColor(username),
          name: username,
        };
      });

      // Get unique Yjs connection ID
      const yClientId = yDoc.clientID;
      const presenceId = InstancePresenceRecordType.createId(yClientId.toString());

      // Set both
      const presenceDerivation = createPresenceStateDerivation(
        userPreferences,
        presenceId
      )(store);

      provider.awareness.setLocalStateField(
        "presence",
        presenceDerivation.get() ?? null
      );

      // Update Yjs when tldraw presence changes
      unsubs.push(
        react("when presence changes", () => {
          const presence = presenceDerivation.get() ?? null;
          requestAnimationFrame(() => {
            provider.awareness.setLocalStateField("presence", presence);
          });
        })
      );

      // Sync Yjs awareness with tldraw
      const handleUpdate = ({ added, updated, removed }) => {
        const states = provider.awareness.getStates();

        const toRemove = [];
        const toPut = [];

        // A user connected to Yjs
        for (const clientId of added) {
          const state = states.get(clientId);
          if (state?.presence && state.presence.id !== presenceId) {
            toPut.push(state.presence);
          }
        }

        // A user's awareness updated
        for (const clientId of updated) {
          const state = states.get(clientId);
          if (state?.presence && state.presence.id !== presenceId) {
            toPut.push(state.presence);
          }
        }

        // A user disconnected from Yjs
        for (const clientId of removed) {
          toRemove.push(
            InstancePresenceRecordType.createId(clientId.toString())
          );
        }

        // Update tldraw with changes
        store.mergeRemoteChanges(() => {
          if (toRemove.length > 0) {
            store.remove(toRemove);
          }
          if (toPut.length > 0) {
            store.put(toPut);
          }
        });
      };

      provider.awareness.on("update", handleUpdate);
      unsubs.push(() => provider.awareness.off("update", handleUpdate));

      setStoreWithStatus({
        store,
        status: "synced-remote",
        connectionStatus: "online",
      });
    }

    if (provider.synced) {
      handleSync();
    } else {
      provider.on("synced", handleSync);
      unsubs.push(() => provider.off("synced", handleSync));
    }

    // fallback if no synced event or property
    if (provider.synced === undefined) {
       handleSync();
    }

    return () => {
      unsubs.forEach((fn) => fn());
      unsubs.length = 0;
    };
  }, [provider, yDoc, store, yStore, username]);

  return storeWithStatus;
}
