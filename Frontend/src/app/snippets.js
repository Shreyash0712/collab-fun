export const LANGUAGE_SNIPPETS = {
  javascript: `// Start writing here\n\nconsole.log("Hello, World!");\n`,
  typescript: `// Start writing here\n\nconst greeting: string = "Hello, World!";\nconsole.log(greeting);\n`,
  python: `# Start writing here\n\nprint("Hello, World!")\n`,
  java: `// Start writing here\n\npublic class Main {\n    public static void main (String[] args) {\n        System.out.println("Hello, World!");\n    } \n}`,
  c: `// Start writing here\n\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
  cpp: `// Start writing here\n\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`,
  csharp: `// Start writing here\n\nusing System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}`,
  go: `// Start writing here\n\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}`,
  rust: `// Start writing here\n\nfn main() {\n    println!("Hello, World!");\n}`,
  php: `<?php\n// Start writing here\n\necho "Hello, World!";\n?>`,
  ruby: `# Start writing here\n\nputs "Hello, World!"\n`,
  swift: `// Start writing here\n\nprint("Hello, World!")\n`,
  kotlin: `// Start writing here\n\nfun main() {\n    println("Hello, World!")\n}`,
  html: `<!-- Start writing here -->\n\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Hello World</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>`,
  css: `/* Start writing here */\n\nbody {\n    background-color: #f0f0f0;\n    color: #333;\n}`,
  json: `{\n    "message": "Hello, World!"\n}`
};

export const LANGUAGES = Object.keys(LANGUAGE_SNIPPETS);
