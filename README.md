# Validolphin

<img alt="Validolphin Logo" src="validolphin-logo.png" width=100 height=100 />

**Validolphin** is a lightweight npm package that provides a zero-dependency system for avoiding tedious data validation.

## Installation

You can install Validolphin using npm. Run the following command:
```
npm install validolphin
```

## Usage
Import the package main class
```javascript
const Validolphin = require('validolphin');
```
Create a config package
```javascript
const config = {
  unexpectedKeyError : <String>,      /* A CUSTOM ERROR WHEN AN OBECT TO VALIDATE HAS A KEY THAT IS NOT EXPECTED */
  unexpectedMissingError : <String>,  /* A CUSTOM ERROR WHEN AN OBECT TO VALIDATE HAS A KEY THAT IS MISSING */
  errorsAtTime : <Number>,            /* THE NUMBER OF ERRORS TO DISPLAY IN THE RETURNED OBJECT, DEFAULT = 3 */
  validables : [                      /* AN ARRAY OF VALUES THAT DEFINES THE VALIDABLES OBJECTS */
    ...
    {
      name : <String>                 /* THE NAME OF THE FUNCTION TO CALL IF YOU WANT TO VALIDATE THE ASSOCIATED OBJECT */,
      schema : {                      /* THE VALIDATION SCHEMA OF THE OBJECT */
        field : {
          type: <Number|String|Array>, 
          minVal : <Number>,            /* SET ONLY IF type == Number */  
          maxVal : <Number>,            /* SET ONLY IF type == Number */ 
          minLen : <Number>,            /* SET ONLY IF type == String */ 
          maxLen : <Number>,            /* SET ONLY IF type == String */ 
          elCount: <Number>,            /* SET ONLY IF type == Array */ 
          homogen: <Boolean>,           /* SET ONLY IF type == Array */ 
          nullable: <Boolean>           /* DEFAULT : false */ 
        },
        ...
    }
    ...
  ]
}
```
Create the validation object
```javascript
const validator = new Validolphin(config);
```
Now, you can call the functions with 
```javascript
validator.<name_of_the_validable_object>( object_to_validate )
```

## Example
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
        medals : { type: Array, nullable: true, homogen: true }
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
