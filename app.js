/* Basic Web Audio Synthesizer */

var SynthPad = (function() {

// Variables
var myCanvas;
var frequencyLabel;
var volumeLabel;


var myAudioContext;
var oscillator;
var gainNode;

// Notes
var lowNote = 261.63; // C4
var highNote = 493.88; // B4



// Constructor
var SynthPad = function() {
		// Handles for HTML DOM elements	
		myCanvas = document.getElementById('synth-pad');
		frequencyLabel = document.getElementById('frequency');
		volumeLabel = document.getElementById('volume');
		knob = document.getElementById('knob');

		// Create an audio context - container for all web audio sources in app - analagous to a patch  
		myAudioContext = new webkitAudioContext();
		// Prep the canvas with listeners
		SynthPad.setupEventListeners();
		// Create a volume control on the Audio Context
		gainNode = myAudioContext.createGainNode();
		// Set up default volume for synth on load - not too loud
		var defaultVolume = 5;
		// Assign volume sent from knob to newly created gain node
		gainNode.gain.value = defaultVolume;
		// Connet the volume control to the output / amplifier
		gainNode.connect(myAudioContext.destination);
		// Display default volume value in the UI 
		volumeLabel.innerHTML = defaultVolume;
	};

	// Event Listeners
	SynthPad.setupEventListeners = function() {

		// Disables scrolling on touch devices
		document.body.addEventListener('touchmove', function(event) {
		event.preventDefault();
		}, false);
		// Set up to receive mouse events for play sound trigger
		myCanvas.addEventListener('mousedown', SynthPad.playSound);
		// Set up to receive touch events on mobile devices
		myCanvas.addEventListener('touchstart', SynthPad.playSound);
		// Set up stop sound event trigger for different devices
		myCanvas.addEventListener('mouseup', SynthPad.stopSound);
		document.addEventListener('mouseleave', SynthPad.stopSound);
		myCanvas.addEventListener('touchend', SynthPad.stopSound);
	};

	// Play a note passing the mouse event to the playSound function
	SynthPad.playSound = function(event) {
		// Create an oscillator on the Audio Context
		oscillator = myAudioContext.createOscillator();
		// Set waveshape of oscillator - Sine is nice to get started
		oscillator.type = 'sine';
		// Connecet the oscillator to the gain 
		oscillator.connect(gainNode);
		// Mouse / touch events are passed to update frequency
		SynthPad.updateFrequency(event);
		// Start oscillator immediately - no time offset
		oscillator.start(0);
		// Call update frequency function when mouse position changes
		myCanvas.addEventListener('mousemove', SynthPad.updateFrequency);
		myCanvas.addEventListener('touchmove', SynthPad.updateFrequency);
		// Stop sound when mouse leaves canvas
		myCanvas.addEventListener('mouseout', SynthPad.stopSound);
	};

	// Called from UI volume knob - overrides defualt volume
	SynthPad.calculateVolume = function(e) {
		var volumeLevel = e;
		// Debugging volume knob
		//console.log("synth Volume " + e);
		// Assign volume sent from knob to newly created gain node
		gainNode.gain.value = volumeLevel;
		// Connet the volume control to the output / amplifier
		gainNode.connect(myAudioContext.destination);
		// Updating volume values in UI elements
		volumeLabel.innerHTML = volumeLevel;
		
	};

	// Stop the audio
	SynthPad.stopSound = function(event) {
		// Stop oscillator immediately	
		oscillator.stop(0);
		// removing all event listeners if user is not interacting with instrument
		myCanvas.removeEventListener('mousemove', SynthPad.updateFrequency);
		myCanvas.removeEventListener('touchmove', SynthPad.updateFrequency);
		myCanvas.removeEventListener('mouseout', SynthPad.stopSound);
	};

	// Calculate the note frequency
	SynthPad.calculateNote = function(posX) {
		var noteDifference = highNote - lowNote;
		var noteOffset = (noteDifference / myCanvas.offsetWidth) * (posX - myCanvas.offsetLeft);
		return lowNote + noteOffset;
	};

	// Calculate the volume
	//SynthPad.calculateVolume = function(posY) {
	//	var volumeLevel = 1 - (((100 / myCanvas.offsetHeight) * (posY - myCanvas.offsetTop)) / 100);
	//	return volumeLevel;
	//};

	// Fetch the new frequency and volume
	SynthPad.calculateFrequency = function(x) {
		var noteValue = SynthPad.calculateNote(x);
		//var volumeValue = SynthPad.calculateVolume(y);
		oscillator.frequency.value = noteValue;
		frequencyLabel.innerHTML = Math.floor(noteValue) + ' Hz';
	
	};

	// Update the note frequency
	SynthPad.updateFrequency = function(event) {
		if (event.type == 'mousedown' || event.type == 'mousemove') {
		SynthPad.calculateFrequency(event.x);
		} else if (event.type == 'touchstart' || event.type == 'touchmove') {
			var touch = event.touches[0];

			SynthPad.calculateFrequency(touch.pageX);
		}
	};

// Export SynthPad created in the constructor
return SynthPad;

})();

// Controls section - jQuery Knob library
$(function() {
    $(".dial").knob(
	{
         	'change':function(e){
            	console.log(e);
            	SynthPad.calculateVolume(e);

            }
	})
});

// Initialize the page - call synthpad constructor
window.onload = function() {
var synthPad = new SynthPad();
}