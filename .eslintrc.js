module.exports = {
  "env": {
    "browser": true
  },
    "extends": ["airbnb", "prettier", "prettier/react"],
    "parser": "babel-eslint",
    "parserOptions": {
      "ecmaFeatures": {
        "experimentalObjectRestSpread": true,
        "jsx": true
      },
      "sourceType": "module"
    },
    "rules":{
      "no-console": "off"
    }
};
