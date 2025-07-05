---
layout: post
title: "Gowin FPGA"
date: 2025-07-05 17:09:21 +0000
comments: true
categories: 
- FPGA
tags:
- fpga
- gowin
---

Recently I bought a Tang Mega 138k, something I was dillying about over for a long time before deciding to do. As a bit of background I previously played around with some stuff with a Gowin FPGA, on the Tang Nano 9k, that I did not talk about, but something I would mention more from now on.

![/images/vgafpga.png](/images/vgafpga.png)

At the time I managed to get the PLL running and some logic to make it output a VGA signal and display a moving box on the screen. After that I was also able to get an RGB display working from the FPGA at 60fps.

![/images/rgbfpga.png](/images/rgbfpga.png)

As a result of that toying around I set up a dev environment that uses Yosys and Apicula as a base to produce gateware for the Tang Nano 9k: https://github.com/davidsiaw/fpga-dev-skel.

I was hoping to try and gain more experience using a more powerful FPGA with more resources and it will be interesting to see what we can do with it.