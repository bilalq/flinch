flinch
======

Multitask with cat-like reflexes

[![Build Status][1]][2] [![Coverage Status][3]][4] [![Dependency Status][5]][6] [![NPM version][7]][8]

Installation
------------
    npm install -g flinch

Features
--------
Flinch provides an easy to use API for blocking and signaling on events. When
you have multiple terminal sessions open and need to queue up long running
commands, flinch comes to the rescue.

Organizing your code into several, small and reusable packages is great.
Unfortunately, you may find yourself needing to build and run tasks in several
repositories at once. When that happens, things can get difficult. Anyone who's
tried to use Git submodules can testify to that.

Flinch exposes a few simple commands

* `flinch server` spawns an HTTP server that acts as the mediator for event blocking and signaling
* `flinch on <event>` will block until the specified event has fired
* `flinch at <event>` will signal that the specified event has occurred,
  causing anything blocking on it to exit with a status code of 0
* `flinch gg <event>` will signal that the specified event has failed, causing
  anything blocking on it to exit with a status code of 1
* `flinch flush` will clear the list of events the server remembers having been fired at

By default, `flinch at` and `flinch gg` announcements have a TTL of 10 minutes,
which helps to alleviate race condition concerns of `flinch on` not being run
until after the event is flinched at. This time can be explicitly set via the
`--ttl` flag.

Usage
-----
```
Usage: flinch [options] [command]

Commands:

  server [options]       start a flinch server
  s                      alias for server command
  on <event>             block on the specified event
  at [options] <event>   announce that the specified event has occurred
  gg [options] <event>   announce that the specified event has failed
  flush                  clear list of announced events
  f                      alias for flush command

Options:

  -h, --help         output usage information
  -V, --version      output the version number
  -p, --port [port]  specify which port to use [Default: 3030]

Options for server command:

  -g, --growl      enable growl notifications

Options for gg and at commands:

  -t, --ttl [ttl]  set time to live for event success announcement in minutes
```

Contrived usage example
-----------------------
After starting `flinch server`, you may do something like this:
``` bash
# Terminal 1
make clean && make && make test && flinch at model

# Terminal 2
make clean && flinch on model && make && flinch at worker

# Terminal 3
rake clean && flinch on model && ./some_script && flinch on worker && rake deploy
```

How it works
------------
Flinch works by having an HTTP server running in the background that acts as a
mediator between blockers and signalers. `flinch on` blockers will poll the
server once per second for updates on the event they're waiting on. `flinch at`
and `flinch gg` will send a POST request to the server to announce the event
status. That's all there is to it.

License
-------
[MIT][9]

  [1]: https://travis-ci.org/bilalq/flinch.png?branch=master
  [2]: https://travis-ci.org/bilalq/flinch
  [3]: https://coveralls.io/repos/bilalq/flinch/badge.png?branch=master
  [4]: https://coveralls.io/r/bilalq/flinch?branch=master
  [5]: https://gemnasium.com/bilalq/flinch.png
  [6]: https://gemnasium.com/bilalq/flinch
  [7]: https://badge.fury.io/js/flinch.png
  [8]: https://npmjs.org/package/flinch
  [9]: https://github.com/bilalq/flinch/blob/master/LICENSE
