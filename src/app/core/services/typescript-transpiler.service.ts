import { Injectable } from '@angular/core';
import { ConsoleLogEntry } from '../models/app.models';

export interface ExecutionResult {
  success: boolean;
  logs: ConsoleLogEntry[];
  returnValue?: any;
  error?: string;
  transpiledJs: string;
}

@Injectable({
  providedIn: 'root'
})
export class TypescriptTranspilerService {

  /**
   * Transpilation complète TypeScript vers JavaScript exécutable 100% côté client.
   * Gère les spécificités de la Séance 9 :
   * - Interfaces et types purs (effacement complet)
   * - Classes composites, implements multiples, délégation
   * - Parameter Properties (constructor(private moteur: Engine) {})
   * - Modificateurs (public, private, protected, readonly, override)
   * - console.assert avec capture explicite
   */
  transpileToJs(tsCode: string): string {
    if (!tsCode) return '';

    let js = tsCode;

    // 1. Transformer les Enums TypeScript
    js = js.replace(/enum\s+([A-Za-z0-9_$]+)\s*\{([^}]+)\}/g, (_match, enumName, body) => {
      const entries = body.split(',').map((e: string) => e.trim()).filter((e: string) => e.length > 0);
      const assignments: string[] = [];
      let autoIndex = 0;

      for (const entry of entries) {
        const parts = entry.split('=').map((p: string) => p.trim());
        const key = parts[0];
        if (parts.length > 1) {
          const val = parts[1];
          const num = Number(val);
          if (!isNaN(num)) {
            autoIndex = num + 1;
            assignments.push(`${enumName}[${enumName}["${key}"] = ${val}] = "${key}";`);
          } else {
            assignments.push(`${enumName}["${key}"] = ${val};`);
          }
        } else {
          assignments.push(`${enumName}[${enumName}["${key}"] = ${autoIndex}] = "${key}";`);
          autoIndex++;
        }
      }

      return `var ${enumName} = (function(${enumName}) {\n  ${assignments.join('\n  ')}\n  return ${enumName};\n})({});`;
    });

    // 2. Transformer les Parameter Properties dans les constructeurs :
    // constructor(private moteur: Moteur, public readonly marque: string) {}
    js = js.replace(/constructor\s*\(([\s\S]*?)\)\s*\{([\s\S]*?)\}/g, (match, paramsStr, bodyStr) => {
      if (!/\b(public|private|protected|readonly|override)\b/.test(paramsStr)) {
        return match;
      }

      const params = paramsStr.split(',');
      const assignments: string[] = [];
      const cleanParams: string[] = [];

      for (const rawParam of params) {
        const trimmed = rawParam.trim();
        if (!trimmed) continue;

        const isParamProperty = /\b(public|private|protected|readonly|override)\b/.test(trimmed);
        const strippedMod = trimmed.replace(/\b(public|private|protected|readonly|override)\s+/g, '').trim();

        const eqIdx = strippedMod.indexOf('=');
        let cleanParam = strippedMod;
        let paramName = '';

        if (eqIdx !== -1) {
          const left = strippedMod.substring(0, eqIdx).trim();
          const right = strippedMod.substring(eqIdx);
          const colonIdx = left.indexOf(':');
          paramName = (colonIdx !== -1 ? left.substring(0, colonIdx) : left).replace(/\?/g, '').trim();
          cleanParam = paramName + ' ' + right;
        } else {
          const colonIdx = strippedMod.indexOf(':');
          paramName = (colonIdx !== -1 ? strippedMod.substring(0, colonIdx) : strippedMod).replace(/\?/g, '').trim();
          cleanParam = paramName;
        }

        if (isParamProperty && paramName) {
          assignments.push(`this.${paramName} = ${paramName};`);
        }
        cleanParams.push(cleanParam);
      }

      if (assignments.length === 0) {
        return match;
      }

      const superMatch = bodyStr.match(/^\s*super\([^)]*\);?/);
      if (superMatch) {
        const superCall = superMatch[0];
        const restBody = bodyStr.slice(superCall.length);
        return `constructor(${cleanParams.join(', ')}) {\n  ${superCall}\n  ${assignments.join('\n  ')}\n${restBody}}`;
      }

      return `constructor(${cleanParams.join(', ')}) {\n  ${assignments.join('\n  ')}\n${bodyStr}}`;
    });

    // 3. Supprimer les interfaces (y compris avec extends)
    js = js.replace(/(?:export\s+)?interface\s+[A-Za-z0-9_$]+(?:\s*<[^>]*>)?(?:\s+extends\s+[^{]+)?\s*\{[\s\S]*?\}/g, '');

    // 4. Supprimer les types (type Nom = ...)
    js = js.replace(/(?:export\s+)?type\s+[A-Za-z0-9_$]+(?:\s*<[^>]*>)?\s*=[\s\S]*?;/g, '');

    // 5. Supprimer les clauses "implements Interface1, Interface2"
    js = js.replace(/\s+implements\s+[A-Za-z0-9_$,\s<>]+/g, '');

    // 6. Supprimer les casts "as Type"
    js = js.replace(/\s+as\s+[A-Za-z0-9_$<>\[\]|&\s]+/g, '');

    // 7. Supprimer les modificateurs de visibilité, readonly et override
    js = js.replace(/\b(public|private|protected|readonly|override)\s+/g, '');

    // 8. Supprimer les génériques <T>, <T extends U>, <string, number>
    js = js.replace(/<[A-Za-z0-9_$,\s|&]+>(?=\s*[\(\{\[])/g, '');

    // 9. Supprimer les types de retour : ): Type { ou ): Type =>
    js = js.replace(/\)\s*:\s*[A-Za-z0-9_$<>\[\]|&\s{}?:]+\s*(=>|\{)/g, ') $1');

    // 10. Supprimer les types dans les paramètres des méthodes / fonctions
    js = js.replace(/(constructor|function|\b[a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(([^)]*)\)\s*(\{|=>)/g, (_m, fnName, paramList, suffix) => {
      let cleanList = paramList.replace(/:\s*\{[^}]*\}/g, '');
      if (!cleanList.includes(':')) {
        return `${fnName}(${cleanList}) ${suffix}`;
      }
      const cleaned = cleanList.split(',').map((p: string) => {
        const parts = p.split('=');
        const left = parts[0].replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\??\s*:\s*[^:]+$/g, '$1').trim();
        return parts.length > 1 ? `${left} = ${parts.slice(1).join('=')}` : left;
      }).join(', ');
      return `${fnName}(${cleaned}) ${suffix}`;
    });

    // 11. Supprimer les types des variables : let x: number = 5
    js = js.replace(/\b(let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[^=;]+=/g, '$1 $2 =');

    // 12. Nettoyer les déclarations de propriétés de classe sans assignation ou avec typage :
    // e.g.  moteur: Engine; ou solde: number = 0; -> solde = 0;
    js = js.replace(/^\s*(static\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[^=;\n]+=\s*/gm, '  $1$2 = ');
    js = js.replace(/^\s*(static\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[^;\n]+;/gm, '  $1$2;');

    return js;
  }

  /**
   * Exécute le code dans un bac à sable en capturant logs, warn, errors et asserts
   */
  executeCode(tsCode: string): ExecutionResult {
    const logs: ConsoleLogEntry[] = [];
    const timestamp = () => new Date().toLocaleTimeString();

    const mockConsole = {
      log: (...args: any[]) => {
        logs.push({
          type: 'log',
          text: args.map(a => this.formatArg(a)).join(' '),
          timestamp: timestamp()
        });
      },
      error: (...args: any[]) => {
        logs.push({
          type: 'error',
          text: args.map(a => this.formatArg(a)).join(' '),
          timestamp: timestamp()
        });
      },
      warn: (...args: any[]) => {
        logs.push({
          type: 'warn',
          text: args.map(a => this.formatArg(a)).join(' '),
          timestamp: timestamp()
        });
      },
      info: (...args: any[]) => {
        logs.push({
          type: 'info',
          text: args.map(a => this.formatArg(a)).join(' '),
          timestamp: timestamp()
        });
      },
      assert: (condition: boolean, ...args: any[]) => {
        if (!condition) {
          logs.push({
            type: 'error',
            text: `Assertion Failed : ${args.map(a => this.formatArg(a)).join(' ') || 'Assertion échouée'}`,
            timestamp: timestamp()
          });
        } else {
          logs.push({
            type: 'info',
            text: `✔ Assertion réussie : ${args.map(a => this.formatArg(a)).join(' ') || 'Condition vérifiée'}`,
            timestamp: timestamp()
          });
        }
      }
    };

    let transpiledJs = '';
    try {
      transpiledJs = this.transpileToJs(tsCode);
    } catch (err: any) {
      return {
        success: false,
        logs: [{
          type: 'error',
          text: `Erreur de transpilation : ${err.message}`,
          timestamp: timestamp()
        }],
        error: err.message,
        transpiledJs: ''
      };
    }

    try {
      const runFn = new Function('console', `
        "use strict";
        ${transpiledJs}
      `);

      const returnValue = runFn(mockConsole);

      return {
        success: true,
        logs,
        returnValue,
        transpiledJs
      };
    } catch (err: any) {
      logs.push({
        type: 'error',
        text: `Runtime Error : ${err.message}`,
        timestamp: timestamp()
      });

      return {
        success: false,
        logs,
        error: err.message,
        transpiledJs
      };
    }
  }

  private formatArg(arg: any): string {
    if (arg === null) return 'null';
    if (arg === undefined) return 'undefined';
    if (typeof arg === 'string') return arg;
    if (typeof arg === 'number' || typeof arg === 'boolean') return String(arg);
    if (typeof arg === 'function') return `[Function: ${arg.name || 'anonymous'}]`;
    if (Array.isArray(arg)) {
      try {
        return JSON.stringify(arg);
      } catch {
        return '[Array]';
      }
    }
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg, null, 2);
      } catch {
        return '[Object]';
      }
    }
    return String(arg);
  }
}
