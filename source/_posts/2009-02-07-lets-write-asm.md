---
layout: post
title: Let's write asm!
categories:
- Programming
tags: []
status: publish
type: post
published: true
meta:
  _edit_last: '2'
---
Today I was asked by a friend to help with his programming assignment. His program needs to take in a number and output the prime factors of the number. For example, 60 = (2^2)(3^1)(5^1)

So after trying to explain the problem to him, I decided to try writing it myself in C. Of course, he wrote his own version in Java.
<!--more-->
``` c
void printPrimeFactors(int num)
{
	int isprime = 0, power;
	int i, z;
	for (i = 2; i <= num; i++)
	{
		// determine if its a prime
		isprime = 1;
		for (z = 2; z < i; z++) { if (i % z == 0 && z != i)  { isprime = 0; } }

		if (!isprime ) { continue; }

		// divide  the crap out of it
		power = 0;
		while (!(num % i))
		{
			num /= i;
			power++;
		}

		if (power > 0)
			printf("(%d^%d)", i, power);
	}
}
```

After looking at the disassembly for that, I realized how often memory gets accessed, and wondered if I could use the registers. Then, I suddenly transformed into Mr. Geeky and tried to write it in asm using the least amount of memory access possible.

``` c
void print(int num, int power)
{
	printf("(%d^%d)", num, power);
}

void printprimefactors(int num)
{

	__asm {
		mov ebx, 2;				// ebx is the current factor 
startloop:

		mov ecx, 2;				// check if its prime. ecx is the number to divide ebx by. if ebx%ecx is zero and if ecx is not ebx, then go to next factor
startcheckprime:
		mov eax, ebx;			// set the high
		cdq;					// set the low
		idiv ecx;				// divide ebx by ecx, the remainder is in edx
		cmp edx, 0;				// if the remainder is not zero then continue
		jne contcheckprime;
		cmp ecx, ebx;			// if ecx and ebx are the same then continue
		je contcheckprime;
		jmp contloop;			// aha. factor is not a prime. continue

contcheckprime:
		add ecx, 1;
		cmp ecx, ebx;			
		jl startcheckprime;		// if ecx < ebx then next

		mov ecx, 0;
		mov eax, num;
		mov edx, 0;
divideloop:
		mov num, eax
		cdq;
		idiv ebx;
		cmp edx, 0;
		jne printout;
		add ecx, 1;
		jmp divideloop;

printout:
		cmp ecx, 0;
		je contloop;
		mov esi,esp;
		push ebx;
		push ecx;
		call print;
		add esp, 08h;

contloop:

		add ebx, 1;
		cmp ebx, num;
		jle startloop;
	}
}
```

Okay, fine theres the memory access in the loop. But it isn't very tight. Of course, even though its written in ASM, its not going to be much faster than the C version due to the call to printf, which will in fact, make up almost all the time the function spends inside itself. Writing this in ASM is completely pointless. I just did it because I felt the itch to.
