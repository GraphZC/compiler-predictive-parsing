/**
  * @param {string} sentence
  * @param {Object} parsingTable 
  * @param {Array<String>} terminals
  * @param {string} startState
  * @param {boolean} verbose
  * 
  * @returns {string}
*/
const predictiveParsing = (
  sentence,
  parsingTable,
  terminals,
  startState = "S",
  verbose = true,
) => {
  let status = null
  const match = []
  let stack = [startState, "$"]
  const input = sentence.split(".")

  const printIter = (matched, stack, input, action, verbose = true) => {
    if (verbose) {
      console.log(
        `${matched.join(".").padEnd(30)} | ${stack.join(".").padEnd(25)} | ${input
          .join(".")
          .padEnd(30)} | ${action}`,
      )
    }
  }

  if (verbose) {
    printIter(["Matched"], ["Stack"], ["Input"], "Action")
  }
  // printIter(match, stack, input, "Initial", verbose)

  while (sentence.length > 0 && status !== false) {
    const topOfInput = input[0]
    const pos = topOfInput

    if (stack[0] === "$" && pos === "$") {
      // printIter(match, stack, input, "Accepted", verbose)
      return true
    }

    if (stack[0] === pos) {
      // printIter(match, stack, input, "Pop", verbose)
      match.push(stack[0])
      stack.shift()
      input.shift()
      continue
    }

    if (stack[0] === "epsilon") {
      // printIter(match, stack, input, "Poping Epsilon", verbose)
      stack.shift()
      continue
    }

    try {
      const production = parsingTable[stack[0]][pos]
      // printIter(match, stack, input, `${stack[0]} -> ${production}`, verbose)
      const newSymbols = production.split(".")
      stack = newSymbols.concat(stack.slice(1))
    } catch (error) {
      throw new Error(`Error for ${stack[0]} on ${pos}, Not Accepted`)
    }
  }

  return false
};
// const parsingTable = {
//   E: { id: "T.E1", "(": "T.E1" },
//   E1: { "+": "+.T.E1", ")": "epsilon", $: "epsilon" },
//   T: { id: "F.T1", "(": "F.T1" },
//   T1: { "+": "epsilon", "*": "*.F.T1", ")": "epsilon", $: "epsilon" },
//   F: { id: "id", "(": "(.E.)" },
// }
// const terminals = ["id", "(", ")", "+", "*"]
// console.log(
//   predictiveParsing("id.+.(.id.+.id.).$", parsingTable, terminals, "E", true),
// )

// console.log(
//   predictiveParsing(
//     "c.c.c.c.d.d.$",
//     { S: { c: "C.C", d: "C.C" }, C: { c: "c.C", d: "d" } },
//     ["c", "d"],
//     "S",
//   ),
// )
