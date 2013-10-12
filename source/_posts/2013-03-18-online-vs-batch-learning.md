---
layout: post
title: Online vs Batch learning
categories:
- Programming
tags:
- batch
- network
- neural
- online
status: publish
type: post
published: true
meta: {}
comments: true
---
While debugging neuron, my new neural network simulation application, I found some (visually) interesting differences between online and batch learning. While batch learning is usually touted as a better form of learning, I found that the two don't seem to make much difference, except for a steppy curve from online learning, as I would expect as the gradient changes differently if you keep calculating the values in a cycle instead of calculating the combined gradient of all the training data.

Here are the results from training a 2-2-1 network with biases with XOR as training data:

<a href="http://labs.astrobunny.net/wp-content/uploads/2013/03/wpid-neuron2.jpg" rel="lightbox"><img src="http://labs.astrobunny.net/wp-content/uploads/2013/03/wpid-neuron2-500x81.jpg" alt="" title="Picture" width="500" height="81" class="alignnone size-medium wp-image-1204" /></a>

with the weights initialized to:

double[] wx0 = { 0.1, 0.2 };
double[] wx1 = { 0.3, 0.4 };
double[] wx2 = { 0.5, 0.6 };

double wh0 = 0.7;
double wh1 = 0.9;
double wh2 = 1.1;

Where wx are the values between the input and hidden layer and wh are the values between the hidden and output layer.

Here is the network topography:

<a href="http://labs.astrobunny.net/wp-content/uploads/2013/03/wpid-neuron1.jpg" rel="lightbox"><img src="http://labs.astrobunny.net/wp-content/uploads/2013/03/wpid-neuron1-500x361.jpg" alt="" title="Picture" width="500" height="361" class="alignnone size-medium wp-image-1204" /></a>

Here is the training error:

<a href="http://labs.astrobunny.net/wp-content/uploads/2013/03/wpid-chart_1-1.png" rel="lightbox"><img src="http://labs.astrobunny.net/wp-content/uploads/2013/03/wpid-chart_1-1-500x272.png" alt="" title="Picture" width="500" height="272" class="alignnone size-medium wp-image-1204" /></a>
