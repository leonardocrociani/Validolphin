# Validolphin

![Validolphin Logo](validolphin-logo.png)

**Validolphin** is a lightweight npm package that provides a zero-dependency system for avoiding tedious data validation.

## Installation

You can install Validolphin using npm. Run the following command:
```
npm install validolphin
```

## Usage

Here's an example of how to use Validolphin in your JavaScript code:

```javascript
const Validolphin = require('validolphin');

// Create an instance of Validolphin by passing a configuration object
const config = {
  validables: [
    {
      name: 'user',
      schema: {
        username: { type: String, minLen: 4, maxLen: 20 },
        email: { type: String, maxLen: 100 },
        age: { type: Number, minVal: 18, maxVal: 100 },
      }
    }
  ]
};

const validator = new Validolphin(config);

// Validate an object using the defined validation function
const user = {
  username: 'john',
  email: 'john@example.com',
  age: 25
};

const validationResult = validator.user(user);

if (validationResult.valid) {
  console.log('Validation successful!');
} else {
  console.error('Validation failed:', validationResult.error);
}

```

## License
This project is licensed under the Creative Commons Attribution 4.0 International License (CC-BY-4.0).

## Issues
If you encounter any issues or have any suggestions, please feel free to open an issue on the GitHub repository.

Enjoy using Validolphin for your data validation needs!
