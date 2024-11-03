// script.js

// Get all <a> tags in the document
var links = document.getElementsByTagName('a');

// Loop through each <a> tag
for (var i = 0; i < links.length; i++) {
    // Check if the href attribute is not equal to '#' and the parent element is not a navbar
    if (links[i].getAttribute('href') !== '#' && links[i].getAttribute('href') !== 'index.html' && !links[i].closest('.navbar')) {
        // Add target="_blank" attribute to <a> tags that meet the criteria
        links[i].setAttribute('target', '_blank');
    }
}
