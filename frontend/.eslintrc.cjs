module.exports = {
   root: true,
   env: { browser: true, es2020: true },
   extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react-hooks/recommended",
      "plugin:prettier/recommended",
      "plugin:tailwindcss/recommended"
   ],
   ignorePatterns: ["dist", ".eslintrc.cjs"],
   parser: "@typescript-eslint/parser",
   plugins: ["react-refresh", "prettier", "tailwindcss"],
   rules: {
      "react-refresh/only-export-components": "off",
      "prettier/prettier": "error",
      "tailwindcss/classnames-order": "error",
      "tailwindcss/enforces-shorthand": "off",
      "tailwindcss/no-contradicting-classname": "error",
      "tailwindcss/no-custom-classname": "warn",
      "react-hooks/exhaustive-deps": "off",
      "no-prototype-builtins": "off",
      "typescript-eslint/ban-ts-comment": "off"
   }
}
