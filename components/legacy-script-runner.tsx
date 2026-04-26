"use client";

import { useEffect, useMemo } from "react";

type LegacyScriptRunnerProps = {
  scripts: string[];
};

const FUNCTION_DECLARATION_PATTERN = /function\s+([A-Za-z_$][\w$]*)\s*\(/g;

const buildWrappedLegacyScript = (scriptBody: string): string => {
  const functionNames = new Set<string>();
  let match = FUNCTION_DECLARATION_PATTERN.exec(scriptBody);
  while (match) {
    functionNames.add(match[1]);
    match = FUNCTION_DECLARATION_PATTERN.exec(scriptBody);
  }
  FUNCTION_DECLARATION_PATTERN.lastIndex = 0;

  const exportsToWindow = [...functionNames]
    .map((name) => `if (typeof ${name} === "function") window.${name} = ${name};`)
    .join("\n");

  return `(() => {\n${scriptBody}\n${exportsToWindow}\n})();`;
};

export default function LegacyScriptRunner({ scripts }: LegacyScriptRunnerProps) {
  const scriptsToRun = useMemo(() => scripts.filter((script) => script.trim().length > 0), [scripts]);

  useEffect(() => {
    const appendedScripts: HTMLScriptElement[] = [];

    scriptsToRun.forEach((scriptBody, index) => {
      const scriptElement = document.createElement("script");
      scriptElement.id = `legacy-inline-script-${index}`;
      // Execute legacy scripts in an isolated scope to avoid
      // "Identifier has already been declared" collisions across routes,
      // then re-export declared legacy functions to window so inline
      // handlers like onclick="showUC(...)" continue to work.
      scriptElement.text = buildWrappedLegacyScript(scriptBody);
      document.body.appendChild(scriptElement);
      appendedScripts.push(scriptElement);
    });

    return () => {
      appendedScripts.forEach((scriptElement) => scriptElement.remove());
    };
  }, [scriptsToRun]);

  return null;
}
