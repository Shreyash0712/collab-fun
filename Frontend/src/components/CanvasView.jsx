import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { useYjsStore } from "../hooks/useYjsStore";

export default function CanvasView({ ydoc, provider, username }) {
  const storeWithStatus = useYjsStore({ yDoc: ydoc, provider, username });

  // Handle images by converting them to base64 Data URIs 
  // so they can sync over Yjs without needing a backend server!
  const myAssetStore = {
    async upload(asset, file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ src: reader.result });
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    },
    resolve(asset) {
      return asset.props.src;
    },
  };

  return (
    <div className="h-full w-full" style={{ touchAction: 'none' }}>
      {storeWithStatus.status === "loading" ? (
        <div className="h-full w-full flex items-center justify-center text-neutral-600 text-sm font-medium">
          Loading Canvas...
        </div>
      ) : (
        <Tldraw
          store={storeWithStatus.store}
          autoFocus
          assets={myAssetStore}
          onMount={(editor) => {
            editor.user.updateUserPreferences({ colorScheme: 'dark' });
          }}
        />
      )}
    </div>
  );
}
