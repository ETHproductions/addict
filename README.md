# addict

A simple language for a simple time https://ethproductions.github.io/addict

## Spec

Addict is a Turing tarpit based on [PRINDEAL](http://codegolf.stackexchange.com/q/54530/42545), a non-Turing-complete variable-based language where the only commands are PRint, INcrement, DEcrement, and ALias.

### Variables

A variable name matches the regex `/^[A-Za-z_]\w*$/`. All variables start out with a value of `0`, and can only contain non-negative integers.

A variable can also have a dynamic name; for example, `abc[var]xyz`. The `[var]` returns the value of `var`; if `var` is currently `7`, this returns the variable `abc7xyz`.

You can also nest dynamic names: `a[b[c]]`

### Commands

- `i x` - increment variable `x` by 1. Succeeds unless no arg is given.
- `d x` - decrement variable `x` by 1. Succeeds unless no arg is given, or the arg is already at 0.
- `t x` - set variable `x` to the next charcode from input. Succeeds unless EOF. (Correctly handles Unicode chars above U+FFFF.)
- `c x` - output variable `x` as a charcode. Succeeds unless no arg is given. (Correctly handles charcodes above 0xFFFF.)
- `n x` - output variable `x` as a number. Succeeds unless no arg is given.

### Aliases

Aliasing has very specific syntax:

    a commandname
     command1
     command2
     command3

This creates a new command called `commandname`. Whenever `commandname` is called, the following process happens:

- `command1` is called.
- If `command1` succeeded, run `command2`.
- If `command1` failed, run `command3`.

You can send arguments to the alias, too. The `n`th argument is called using `n`. For example:

    a zero  # Sets the input variable to 0:
     d 1    #   Decrement the input var.
     zero 1 #   If decrementing succeeded, run `zero` on the var again.
     i _    #   Otherwise, return success.

This can then be called as `zero myVar`, and it will set `myVar` to 0.

**Note:** `0` is always `0`, no matter what you do to it.

Sometimes you'll want to grab the `n`th argument, but `n` is a variable. This can simply be done with `[n]`. Be careful with using numbers, though: `[1]` will not return the first argument; it will return the argument at index [value of 1st argument].

Additionally, you can select groups of arguments:

     myFunc *    # Call myFunc with all arguments
     myFunc 1*   # Call myFunc with all but the first argument
     myFunc *1   # Call myFunc with only the first argument
     myFunc -1*  # Call myFunc with only the last argument
     myFunc *-1  # Call myFunc with all but the last argument
     myFunc 1*3  # Call myFunc, excluding the first argument and anything after the third
     myFunc 1*-1 # Call myFunc with all but the first and last arguments
     # etc.

## Example programs

### `cat`

    a input  # Define a command `input` that does the following:
     t char  #   Set variable `char` to the next charcode in the input.
     output  #   If there is a next charcode, run command `output`.
     d       #   Otherwise, just exit.
    
    a output # Define a command `output` that does the following:
     c char  #   Output variable `char` as a charcode.
     input   #   Attempt to input again.
     d       #   (This line never gets run.)
    
    input  # Run command `input`.
