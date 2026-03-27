export type LabInsight = {
  disclaimer: string;
  big_picture: string;
  good_results: unknown[];
  areas_of_attention: unknown[];
  next_steps: string;
};

export type AnalyzeLabFileSuccess = {
  ok: true;
  data: LabInsight;
};

export type AnalyzeLabFileError = {
  ok: false;
  status: number;
  message: string;
};