Such tragedy!

Transcendent Galaxy-Brain Algorithms got renamed to Transcendent Universe-Brain Loops, to be a bit more faithful to what these describe:    
a thing that can read/write as much as possible, connects input to output in any ways, and forever does all that in quick steps, and learns its own self-equivalent.    
Nothing else is essential for any thing.

(The picked words for the title may still be a turn-off to some, but I refuse to sacrifice scientific integrity for scientific fashion. The title is too accurate to mince words.)

This paper also introduces Linearithmic Dense Layers (LDLs), which make those steps efficient and scalable. Replacing vanilla dense layers with those improves capacity and performance at no cost, at least where this was tested. (Have not yet seen LDLs anywhere else, at least.)

# Future work

Well sorry, sunshine, but it's not like I can implement anything I want in an instant.

TUBL suggests how to implement AGI, but for that we still need:

- The RNN implementation, always predicting its next input, learning online.
    - As efficient, no-synchronization-stalls, and uniform-timing as it could be. (For example, do not do the whole backprop pass at once, only backprop one step per step.)
    - (With LDL and probably a pix2pix-like loss, should not be very difficult.)
    - Accessed via an interface that takes how many floats to input and output (output simply copies floats from internal state) at each step.
        - Outputs intentionally have no explicit gradient, no RL to guide them. Thus, non-random behavior can only be learned if mesa-optimization is successfully learned from data, so this is the ultimate test of the theory.
    - On startup (also accepting the batch dimension), load from file if possible; periodically save checkpoints to files.
- Environment. From either the Web(-driver) or a window, pull pixels (foveated imaging around the mouse for speed?) and possibly sound, and push mouse and scroll and keyboard state (or [emulate a mobile device](https://github.com/deepmind/android_env) to only deal with a pointer), and time-since-last-frame.
    - Pixel prediction, for ease of use: one reserved color that gets replaced with the previous next-frame prediction (so it does not cause misprediction gradient).
        - A prediction-only home page. An output that goes there, when the float becomes ≥1. (This implies that the environment should be implemented as a web driver. Page transition commands should be ignored unless 10 seconds apart.)
        - Optionally, for human UI, either overlay a partially-transparent canvas or window that shows those predictions, or show the full window of pixels.
    - Data:
        - Expose datasets as web pages, for example, by showing inputs on the left, and after a delay, intended outputs on the right (possibly printed as text) (possibly waiting to be fully scrolled-to, if there are too many samples).
            - An output that goes to a random page from here, when the float becomes ≥1.
        - Pull in a fragment of the Web (probably best done dynamically, but browser caching is inconsistent).
            - An output that goes to a random page from here, when the float becomes ≥1.
            - Written-by-RNN text can only become coherent if prediction tries to lead to more coherent places than before, as pix2pix does; then random garbage becomes incompressible and forgotten, whereas semi-coherent output gets remembered and gradually reinforced. For more guarantees, we could allow humans to record interaction examples, and replay them, causing coherent actions to become learned.
        - Allow actual Internet interaction, unless you're chicken. ([Might have to fight against bot racism, though.](https://stackoverflow.com/questions/33225947/can-a-website-detect-when-you-are-using-selenium-with-chromedriver))
    - Data augmentation, via Web extensions:
        - To learn pixel-prediction from surroundings rather than the past: when loading a DOM tree, temporarily replace a random part of it with either nothing or a blank space or a [loading spinner](https://loading.io/css/) for a second.
        - To learn to ignore zoom, rotation, translation, color changes: periodically add a random 3D-transform or filter to random DOM elements, with a 1-second transition, resetting after 20 seconds.
    - Speed and stability:
        - For training on a compute cluster, launch the same model on many machines and synchronize gradients.
        - Limit browser processes' resource usage.
        - If a browser process ends, re-launch it, providing zeros as its inputs in the meantime.