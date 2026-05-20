/**
 * EntropyLab JSON Export v2.0
 * Compatible with IKPS-CORE projection output
 */

import { EPS } from '../core/projectionOperator';

export function formatEntropyLabJSON(eps: EPS, projectRef: string = ""): object {
  const sessionId = `IKPS-${eps.timestamp}`;
  
  const projectNames: Record<string, string> = {
    "E-LAB-01": "ENTROPIA",
    "E-LAB-02": "ENTRO-AI",
    "E-LAB-03": "ENTRO-CORE",
    "E-LAB-04": "ENTRO-ENGINE",
    "E-LAB-05": "ENTRO-EVO",
    "E-LAB-06": "ENTRO-NET",
    "E-LAB-07": "ENTRO-QUANTUM",
    "E-LAB-08": "ENTRO-PULSE",
    "E-LAB-09": "ENTRO-PULSE",
    "E-LAB-10": "ENTRO-OMEGA",
    "IKPS": "IKPS-CORE"
  };
  
  const resolvedName = projectNames[projectRef] || null;
  
  return {
    entropylab: {
      schema_version: "2.0.0",
      project: "IKPS-CORE",
      module: "Epistemic Projection Operator",
      session_id: sessionId,
      timestamp: eps.timestamp,
      dialogue_length: eps.curves.semanticDrift.length,
      project_ref: projectRef || null,
      project_name: resolvedName
    },
    projection: {
      per_turn: eps.curves.semanticDrift.map((_, i) => ({
        turn: i + 1,
        CSD: parseFloat((eps.curves.semanticDrift[i] * 100).toFixed(1)),
        OSE: parseFloat((eps.curves.epistemicEntropy[i] * 100).toFixed(1)),
        PAI: parseFloat((eps.raw.presuppositionCounts[i] * 20).toFixed(1)),
        EI: parseFloat((eps.curves.affectiveDimension[i] * 100).toFixed(1)),
        is_inflection_point: eps.metrics.inflectionPoints.includes(i)
      })),
      summary: {
        total_semantic_drift: parseFloat((eps.metrics.cumulativeDrift * 100).toFixed(2)),
        final_option_entropy: parseFloat((eps.metrics.finalEntropy * 100).toFixed(2)),
        entropy_drop: parseFloat((eps.metrics.entropyDrop * 100).toFixed(2)),
        inflection_points: eps.metrics.inflectionPoints.map(p => p + 1),
        inflection_count: eps.metrics.inflectionPoints.length,
        convergence_type: eps.metrics.convergenceType,
        affective_regime: eps.metrics.affectiveRegime
      }
    },
    classification: {
      convergence_label: {
        open_exploration: "Open Exploration",
        organic_convergence: "Organic Convergence",
        forced_convergence: "Forced Convergence"
      }[eps.metrics.convergenceType] || "",
      affective_label: {
        stable: "Stable",
        rising: "Rising",
        falling: "Falling",
        volatile: "Volatile"
      }[eps.metrics.affectiveRegime] || ""
    },
    entropylab_integration: {
      compatible_modules: ["IKPS-CORE", "ENTRO-OMEGA", "UAS-Framework"],
      recommended_next: eps.metrics.convergenceType === "forced_convergence"
        ? "Embedded assumption layer analysis — PAI deep scan"
        : "Comparison with baseline corpus",
      export_format: "EntropyLab JSON v2.0"
    }
  };
}

export function downloadJSON(data: object, filename: string): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
