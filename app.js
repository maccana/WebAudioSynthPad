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

		SynthPad.setupEventListeners();

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
		// Create a volume control on the Audio Context
		gainNode = myAudioContext.createGainNode();
		// Set waveshape of oscillator
		oscillator.type = 'sine';
		// Connet the volume control to the output / amplifier
		gainNode.connect(myAudioContext.destination);
		// Connecet the oscillator to the volumne control 
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

	// Set the volume fro UI knob
	SynthPad.calculateVolume = function(e) {
		var volumeLevel = e;
		console.log("synth calculate Vol " + e);
		var gOut = gainNode.gain.value = Math.floor(volumeLevel);
		console.log("gain = " + gOut);
	
		volumeLabel.innerHTML = volumeLevel + '%';
		knob.value = volumeLevel;
		//return volumeLevel;
	};

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
// Control section
$(function() {
    $(".dial").knob(
	{
	         		'change':function(e){
	                        console.log(e);
	                        SynthPad.calculateVolume(e);

	                }
	            })
});

// Initialize the page.
window.onload = function() {
var synthPad = new SynthPad();
}