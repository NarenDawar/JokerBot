/*
<, >, >=, <= are all operators

=== means equal to
!=== means not equal to

&& (and) operator, scans to make sure both statements are true, if one or all are false, output is false
|| (or) opertor, scans to make sure AT LEAST one statement is true, if at least one statement is true, output is true

regular if - if else - else

let stopLight = 'yellow';

if (stopLight === 'red') {
    console.log("Stop!");
} else if (stopLight === 'yellow') {
    console.log('Slow down!);
} else (stopLight === 'green') {
    console.log('Gooo!!!!');
}



if-else replacement

let theNumber = 'one'

theNumber ? console.log('The number is one!') : console.log('The number is not one!');
? = true response
: = false response

instead of if- else assigment, use:

let defaultName = username || 'Stranger';
This means if the person has an account, they will be referred to by their username
If the user doesn't have account, they will be referred to as a "stranger"



if - else if - else statements replacement:

let itemOne = "apple";

switch (itemOne) {
    case 'apple':
        console.log('Your first item is an apple!);
        break;
    case 'banana':
        console.log('Your first item is a banana!');
        break;
    case 'strawberry':
        console.log('Your first item is a strawberry);
        break;
    default:
        console.log('First item is not identifiable);
        break;
    
}

**default is the else statement**
*/