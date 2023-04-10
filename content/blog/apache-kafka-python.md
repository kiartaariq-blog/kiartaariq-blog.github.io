---
title: Apache Kafka with a Python implementation
author: Taariq Nazar
layout: blog
createdAt: April 8th 2023
description: "In this post we will teach you about Apache Kafka and how one can
implement a simple module which utilizes it."
tags: [Apache Kafka, Tutorial, Python]
toc: true
---
## Apache Kafka

So what is Apache Kafka? Apache Kafka is an internal application messaging
system which has a particular workflow. It has a notion of producers and
consumers. Where in a broad sense, Producers, produce information and Consumers,
consume information. Why is this useful? We'll as the workflow in the current
state is centered around the notion of micro-services a need for an effecient
way for these modules to converse with each is evident. Apache Kafka is one way
for communications between these services. The idea is simple and I believe the
best way to explain it would be through an example. 

### Example

Say, we want to build an app that displays the information of a basketball
game. What are the components we need? We will need a part that gathers the data
from the internet aswell as a component that displays this information. In the
context of Apache Kafka. The module that gathers the data and sends it to the
display module is called a producer. Since it produces data that is ready to be
used or consumed. The module that displays the data is called the consumer.
Since it consumes the data being given to it. It might not be evident why one
would want to introduce Apache Kafka in this scenario. The reason for using
Apache Kafka is that it is easily scalable. Say we want to add more features.
Say player statistics, then instead of contaminating the original data
producer, we create a whole new module. Which the display module consumes from.

### Topics
Formally, how is this all done. For this we need to introduce the notion of
topics. Topics are tagged messaging queues. Producers add data to these ques
under a specific topic. Consumers on the other hand **subscribe** to specific
topics which they then consume the data from them. So each Producer can write to
specific topics and each consumer can read from specific topics.

## Implementation
Maybe add context to what I want to build? Maybe build an app that reads data
from some website and an app that displays this data in real time? Stock data
maybe? Or a basketball match? Create a python app and a vue app.

Now to the implementation. What is it we need. To begin with we need to create
two modules. A Producer and a consumer. I will begin with the most basic case
and start with a single producer and a single consumer. 

## Setting up Apache Kafka
To begin with we need to install Apache Kafka on your system. How does on
install Apache Kafka? Maybe Docker? or is that too much for a person to think
off? Because then they need to understand Docker.

### Producer

To begin with, I assume that you have python installed. Begin with installing
apache kafka using pip
```console
pip install apache-kafka
```
Now, lets start writing some code. To begin with we'll need to import the
necessary libraries.
```python
from apache-kafka import Producer
from time import time
```
The main function should be 
```python
from apache-kafka import Producer
from time import time

def main():
  # Define a producer
  producer = Producer....?
```
Now, we want to create a loop from which we fetch data from some source.
```python
from apache-kafka import Producer
from time import time

def main():
  # Define a producer
  producer = Producer....?

  while True:
    #Fetch data...
    producer.send(...)
    time.sleep(3000)
```
This is the main logic of the producer module. Now lets fill in the gap.
