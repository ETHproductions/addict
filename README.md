# addict

A simple language for a simple time https://ethproductions.github.io/addict

## Spec

Addict is a Turing tarpit based on [PRINDEAL](http://codegolf.stackexchange.com/q/54530/42545), a non-Turing-complete variable-based language where the only commands are PRint, INcrement, DEcrement, and ALias.

### Variables

A variable name matches the regex `/^[A-Za-z_]\w*$/`. All variables start out with a value of `0`, and can only contain non-negative integers.

### Commands

- `i x` - increment variable `x` by 1. Succeeds unless no arg is given.
- `d x` - decrement variable `x` by 1. Succeeds unless no arg is given, or the arg is already at 0.
- `t x` - set variable `x` to the next charcode from input. Succeeds unless EOF. (Correctly handles Unicode chars above U+FFFF.)
- `c x` - output variable `x` as a charcode. Succeeds unless no arg is given. (Correctly handles charcodes above 0xFFFF.)

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

You can send arguments to the alias, too. The `n`th argument is called using `n` For example:

    a zero  # Sets the input variable to 0:
     d 1    #   Decrement the input var.
     zero 1 #   If decrementing succeeded, run `zero` on the var again.
     i _    #   Otherwise, return success.

This can then be called as `zero myVar`, and it will set `myVar` to 0.

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
