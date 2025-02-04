---
title: "My Code Didn't Need a Refactor, It Needed a Passport"
date: 2025-01-06T20:30:38+11:00
draft: false
---

I am a sucker for a good logic puzzle. I am also a sucker for a good
leaderboard. And  I am also also a sucker for a good software engineering
problem - which is really just an extension of a good logic puzzle.

It is quite fortunate then that PuzzleTeam host an array of logic puzzles online,
such as [Pipes](https://puzzle-pipes.com) and
[Binairo](https://puzzle-binairo.com). It is also quite fortunate then that
those online puzzles are backed by daily, weekly, monthly, and all-time
leaderboards where people can compete to complete the puzzle in the shortest
time. And it is also also quite fortunate that there is a seperate
"Robots / programmatic solvers" leaderboard for each of those puzzles.

_This post will focus mainly on [Pipes](https://puzzle-pipes.com) and
[Binairo](https://puzzle-binairo.com), however I highly recommend you try any
of the other puzzles by PuzzleTeam too._

In the midst of the pandemic and lockdowns, when everyone was scrambling for
at-home hobbies, I stumbled across [Pipes](https://puzzle-pipes.com). An online
puzzle where you click to rotate sections of pipe to connect to other sections
of pipe with the end goal being a completed and connected network of pipes.

It brings together some of my favourite things - logic puzzle, a pinch of graph
theory, and mindlessly clicking away for hours. _How exciting!_ Naturally I
became obsessed with getting better and getting quicker. I started by brute
forcing - rotating every pipe until it looked good, and clicking (and
re-clicking) submit until my solution was accepted.

Over time I improved. I was able to work out that pipes against the edges of
the puzzle must be oriented in a certain way. (Such that bars `┃` and tees `┣` 
must have their flat side against the edge). I was able to build on that with 
other tidbits of logic such that I could fill more of the puzzle with known
rotations. Eventually I had a suite of "rules" which I could apply across the
puzzle to give me a valid solution with no guessing.

You know what? That kinda smells a lot like an algorithm.

I whipped my trusty Python and got cracking. I started by codifying the puzzle
as a (flat) grid of bit fields, where each piece's edge is represented by a flag
indicating whether a pipe was present on that edge. For example a bar `┃` is
stored as the int `0b1010`. 

I was able to piece together a toolbox of Pipes puzzle solving functions, such
as the ability to rotate a tile.

```python
def tile_rotate_clockwise(x: int) -> int:
    return ((x << 3) | (x >> 1)) & 0b1111
```

Or lock a tile.

```python
def lock(grid: list[int], x: int) -> None:
    grid[x] = 1
```

Or the abliity to check whether the whole grid was locked and therefore complete.

```python
def locked_game(size: int, grid: list[int]) -> bool:
    return sum(grid) == size ** 2
```

With the codified rules, and some functions for parsing (and submitting) the
puzzle input, I was ready to run my very fast Pipes puzzle solver.

```sh
$ python3 main.py

New game: 439a147e389eb2a32d774a344
Current:
╸┗┏┃╺
╸┻┫┗╻
┏┫┣╹┃
┗╹┳┻┻
╸┃┗╸╸

Current:
╺┓┏━╸
╺┫┣┓╻
┏┻┫╹┃
┗╸┣┳┫
╺━┛╹╹

38 moves. Congratulations! You have solved the puzzle in 00:00.746
```

_Nice._ 746ms seems reasonable. And it put me squarely in first place on the
programmatic leaderboard. I was the only person to attempt programmatically
solving the Pipes puzzle so I was one of one, but I was still first nonetheless.
But also dead last, and that's a problem - I could do better.

The math wasn't quite adding up either. For every move, I checked (and
potentially moved) every tile. So for the 5x5 grid (25 tiles), solving it in 38
moves requires touching tiles about 23,750 times. 746ms just felt a bit slow
for how many iterations I was making.

I blamed this on Python since it is notoriously slow and heavy-handed. Most of
my logic was simple bit manipulation, so surely it would be faster if I just
rewrote it in C, right? So I did.

```c
int tile_rotate_clockwise(int x) {
    return ((x << 3) | (x >> 1)) & 15;
}

void lock(int* grid, int x) {
    grid[x] = 1;
}

int locked_game(int size, int* grid) {
    for (int i = 0; i < (size * size); i++) {
        if (grid[i] == 0) {
            return 0;
        }
    }

    return 1;
}
```

I kept the parsing logic in Python (since I'm not very good at C), and
referenced my new C function `do_game` from Python. This meant that the game
solving code and all the bit manipulation stayed within C.

Now I was ready for a huge speed boost, and to have a submission to be a
fraction of what Python was capable of. NB: I have actually since lost my
original Python code that called the C functions, but the output went something
like this.

```sh
$ python3 main.py

New game: 439a147e389eb2a32d774a344
Current:
╸┗┏┃╺
╸┻┫┗╻
┏┫┣╹┃
┗╹┳┻┻
╸┃┗╸╸

Current:
╺┓┏━╸
╺┫┣┓╻
┏┻┫╹┃
┗╸┣┳┫
╺━┛╹╹

38 moves. Congratulations! You have solved the puzzle in 00:00.550
```

Erm, that didn't sound right. It was in C so it was supposed to be super fast.
I then just put it down to some slowness incurred when referencing the C
extensions from Python. So, as is my nature, I embarked on another rewrite.
This time attempting to rewrite the whole thing in Go - Python was too slow, and
I'm not very good at C. I had also recently started a new job as a Go engineer
so this presented a good opportunity to sharpen my tools.

```go
func tileRotateClockwise(int x) int {
    return ((x << 3) | (x >> 1)) & 15
}

func lock(grid []int, x int) {
    grid[x] = 1
}

func lockedGame(grid []int) bool {
    for _, cell := range grid {
        if cell == 0 {
            return false
        }
    }

    return true
}
```

Unfortunately, despite my persevering efforts, the performance was only on par
with the Python/C solution. I was bitterly disappointed the lack of leaps and 
bounds, and so sat on this as my best attempt for about 3 years.

That is until I came across [Binairo](https://puzzle-binairo.com), a logic
puzzle that involves plotting a grid with black and white dots. The placement of
dots follow a few simple constraints: each row and column must contain the same
number of black and white dots, there must be no more than two dots of the
same colour adjacent to each other, and each row and column must be unique.

I will skip the tedious details, but I essentially followed the same process to
codify and solve the puzzle. Programtically solve it in Python, _nice_. Move the
logic into a C extension, _nicer_. Do a complete rewrite into Go,
_disappointment_. Disappointed only because, again, performance was only on par
with the Python/C solution.

This time, however, I was a little more curious, and a little bit smarter,
and a little more bothered. Through digging around the network requests in the
Chrome dev tools, (to work out where the puzzle input was located, and
submission details), I noticed this in the networking tab.

![screenshot of chrome networking tab](/images/code-with-a-passport/network.png)

Fetching the puzzle page was taking a whopping ~190ms. Double that to account
for the submission request, and I figured ~380s was being chewed up on the
requests and responses making their long round trips.

So I did some digging into the network requests that were being made to
investigate what farfetched journey the requests were taking. First, I needed to
investigate _where_ all of my requests were going, the puzzle server's IP
address. I started with a simple DNS lookup on the domain name.

NB: I have chopped out the boring bits of the command outputs, and copied only the
interesting bits for your reading pleasure.

```sh
$ dig puzzle-binairo.com

;; ANSWER SECTION:
puzzle-pipes.com.	1648	IN	A	52.25.152.19
```

The IP address by itself meant nothing, but I could dig further. `whois` would
give me details about the allocation of the IP address from IANA (Internet
Assigned Numbers Authority, aka the global body in charge of IP addresses).

```sh
$ whois 52.25.152.19

NetRange:       52.0.0.0 - 52.79.255.255
CIDR:           52.0.0.0/10, 52.64.0.0/12
NetName:        AT-88-Z
NetHandle:      NET-52-0-0-0-1
Parent:         NET52 (NET-52-0-0-0-0)
NetType:        Direct Allocation
OriginAS:
Organization:   Amazon Technologies Inc. (AT-88-Z)
RegDate:        1991-12-19
Updated:        2024-02-05
Comment:        Geofeed http://ip-ranges.amazonaws.com/geo-ip-feed.csv
Ref:            https://rdap.arin.net/registry/ip/52.0.0.0
```

Two particular lines jumped out at me.

```sh
Organization:   Amazon Technologies Inc. (AT-88-Z)
Comment:        Geofeed http://ip-ranges.amazonaws.com/geo-ip-feed.csv
```

Which told me that the service was most likely hosted on AWS. They also provided 
some additional details related to the IP address. The CSV file contained a list
of all the AWS CIDR IP ranges as well as some seemingly geographical 
information as to where each IP range is located.

![screenshot of csv file showing ip range and geo details](/images/code-with-a-passport/csv.png)

A quick Google search for "Boardman, USA" lead me to find that it was a "City in
Oregon" (which matches the region code `US-OR`). And while I could infer that
the IP address is located in the AWS region "us-west-2" aka "US West (Oregon)",
I wasn't quite satisfied.

A very small amount of research later, and I stumbled across a document that
similarly listed some rudimentary details about each IP range. [https://ip-ranges.amazonaws.com/ip-ranges.json](https://ip-ranges.amazonaws.com/ip-ranges.json). Though importantly, it presented some key information I was after.


```json
{
    "ip_prefix": "52.24.0.0/14",
    "region": "us-west-2",
    "service": "AMAZON",
    "network_border_group": "us-west-2"
}
```

```json
{
    "ip_prefix": "52.24.0.0/14",
    "region": "us-west-2",
    "service": "EC2",
    "network_border_group": "us-west-2"
}
```

Finding two entries for the IP range, I was now reasonably sure that: The
website was hosted on a compute service, in the us-west-2 aka US West (Oregon)
region, on AWS.

This was the moment I realised that my code didn't need a refactor, it needed a
passport. A round trip from Melbourne to Oregon is expensive - about AUD$1800 by
air, or about ~190ms by the wire.

I could have done some further invesigation to determine whether the server
was deployed onto: an EC2 instance, EKS, Elastic Beanstalk, whatever. But I
figured I had enough to play around with.

I jumped into AWS and navigated to `us-west-2`. I knew I was running this to
only attempt a few solves, so I wasn't particularly concerned with costs. So
naturally I spun up a grossly oversized t2.2xlarge (8 vCPUs, 32GB) instance.
I installed Go and copy-pasted my code directly onto the remote via SSH.

With a returned sense of hope, I ran my solver.

![screenshot of binairo robotic leaderboard](/images/code-with-a-passport/leaderboard.png)

Amazing! This was the result I could have only dreamed over. I had a recorded 
a speedy 2ms. Being the second fastest possible solution given the 1ms
resolution, I was quite satisfied with my attempts and proud of my pole
position. I ran my solver against all the other puzzle sizes to secure my
standing across as many leaderboards as I could.

## Reflections

Consider these typical latencies:
- CPU instruction: ~1ns
- Memory access: ~100ns
- Network within same region: ~1ms
- Cross-continental network: ~100-200ms

My intense focus on code optimisation had missed the forest for the trees. The 
real bottleneck wasn't in the computation but in the geography.

Most of my problem solving was focused around algorithmic and programmatic
improvements. And while this was useful for making marginal improvements, the
best possible solution came from considering the full process of solving the
puzzle input. That is, to consider the time it takes for:

1. The initial puzzle request to make it to and from the puzzle's server.
2. The logical time to solve the puzzle.
3. The time to send and receive the submission request and response from the
same server.

My problem solving journey was incremental, but lead me to eventually think
outside the box when finding areas of improvement. I was also only able to
achieve greater results by persevering through the plateau of performance
improvements. 

Most importantly, I realised that the best work was done by taking a step back
to review the whole problem space.
