---
title: "How Caffeinated is Bailey Butler Today?"
date: 2026-03-16T19:48:00+11:00
draft: false
---

If you were to ask me "Bailey, how many coffees have you had today?", I could
probably give you an answer. But how can I really _know_?

It started with
[IsBaileyButlerInTheOffice.Today](https://isbaileybutlerintheoffice.today) (or
IBBITOT for short), a service I had built to track whether I'm in the office on
any given day. I habitually have a coffee when I get into the office every day.
My colleagues, fascinated by IBBITOT and my coffee drinking habits, started
asking the question: _"how caffeinated is Bailey Butler today?"_

Knowing I had _a_ coffee is one thing. Knowing how much caffeine is currently
running through my body at 10:45am is another. That distinction is what led me
down a rabbit hole of quasi-scientific research into caffeine and the body. The
parameters I landed on, roughly scaled to my body weight:

- `80mg` - caffeine in a single shot of espresso
- `4 hours` - the metabolic half-life of caffeine
- `400mg` - where performance peaks, the green zone
- `2000mg` - where consumption becomes a detriment, the danger zone

Armed with just enough data, I built the first version of Bailey's Caffeine
Tracker ([https://baileyneeds.coffee](https://baileyneeds.coffee)). Although
building the service was only half the struggle. I had to find reliable signals
of my caffeine intake.

### Transaction Data

The first signal was the easiest. I use Up Bank for buying my coffees, who
conveniently offer API access to transaction data. In the first version of the
caffeine tracker I assumed my regular order, a double oat latte, and inferred a
caffeine event from every cafe transaction. Eventually this turned into a lookup
map where I could find my order based on the cafe name and amount spent.

![screenshot of caffeine tracker showing transaction based coffees](/images/how-caffeinated-is-bailey-butler-today/transaction-coffees.png)

While impressive that I was able to surface _something_, I wasn't quite
satisfied that it was comprehensively capturing my caffeine intake.

### Power Data

My obvious gap was homemade coffees. While arguably one of the perks of homemade
coffees is that they're free, this meant caffeine tracker wasn't capturing those
events.

Fortunately, I had a spare smart power meter and a Home Assistant setup at home.
I plugged the coffee machine into the power meter and set up an automation to
send a HTTP event to my caffeine tracker backend every time the machine was
powered up. I did also have to fiddle around to debounce the espresso machine's
power on and power off cycles as it balances power with ideal temperature.

![screenshot showing home assistant automation to trigger when coffee power is above 500](/images/how-caffeinated-is-bailey-butler-today/homeassistant.png)

This covered 91% of the coffees I consume, but something was _still_ missing.

### Location Data

I regularly visit a cafe with family where we take turns paying. When someone
else pays, there's no transaction to capture. But using the Home Assistant
companion app, I could set up a geofence and another automation. Anytime I'm
near the cafe, assume I've ordered my regular, a double oat latte, and create a
caffeine event. This is reliable enough as I don't have any other business being
in the area other than having coffee, and even if I did, well I guess I would
_have_ to order a coffee for the sake of data accuracy.

These three signals put me in a really good spot as I was capturing every single
caffeine event I was having. Until I wasn't.

### Disruption

Then I changed jobs.

My new job has an onsite barista with free coffees. No transaction, no power,
no location (or at least where GPS could discriminate between getting a coffee
and being at my desk). Even worse, it broke the core behaviour of IBBITOT which
had previously relied on transaction data.

I had made peace with this for a while. I brainstormed with ex-colleagues, and
even Claude, and some ideas were thrown around: creating a button that
could be pressed, a heat sensor on my desk or mug, or even installing NFC/BLE
beacons near the coffee machine. While clever ideas, none of them had the
elegance I was really going for, they all required a manual action to happen. I
would be synthesising data for the purpose of tracking, rather than using data
that already existed.

### WiFi Data

The NFC/BLE beacon idea stuck with me though, not because I liked it, but
because it took my mind to WiFi.

The office WiFi uses a common SSID, however each access point has its own unique
BSSID. If I could figure out which access point my phone connected to when I was
in the kitchen, I could passively detect when I was likely getting a coffee.
With some help from Claude, I built a native iOS app that periodically collects
the BSSID of the access point my phone is connected to and sends it to my event
ingestion service. When a known BSSID is seen, a caffeine event is created.

![screenshot showing bssid app with settings to send bssid to caffeine tracker](/images/how-caffeinated-is-bailey-butler-today/bssid.PNG)

No buttons, no beacons, no action.

## Reflections

This whole project (and IBBITOT too) hasn't been technically challenging. At its
core, it's really just been about plumbing data sources into either my event
ingestion service or directly into the caffeine tracker. The hardest part has
been the discovery work of exactly what data I can get my hands on, and then
creatively thinking about what inferences I can make from the data.

I'm sure this is no surprise to big tech, but it's been fascinating (and perhaps
worrying) to understand just how much data is being collected about me. It's not
difficult to extrapolate the thought that if I can take 4 seemingly unrelated
signals, and correlate it to concrete caffeine consumption, then creating a
whole profile of who I am and what I do isn't so hard.

While the data collection by our tech overlords is inevitable, I may as well
enjoy the novelty of playing around with it myself. For now though, [Bailey's
Caffeine Tracker](https://baileyneeds.coffee) is perfect. It captures 100% of
the caffeine events I have. Well, until it doesn't.
