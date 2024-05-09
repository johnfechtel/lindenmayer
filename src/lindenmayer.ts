export function lindenmayer() {
  let variables = ["X", "F"];
  let constants = [];
  let axiom = "X";

  let rules = [
    {
      input: "X",
      output: "F+[[X]-X]-F[-FX]+X",
    },
    {
      input: "F",
      output: "FF",
    },
  ];

  let generations = 3;

  let result = axiom;
  while (generations > 0) {
    let generationResult = "";
    result.split("").forEach((char) => {
      let rule = rules.find((e) => e.input === char);
      if (rule != undefined) {
        generationResult += rule.output;
      } else {
        generationResult += char;
      }
    });

    result = generationResult;
    generations--;
  }

  console.log(result);
}
