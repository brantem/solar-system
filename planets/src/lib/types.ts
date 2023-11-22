export type File = {
  key: string;
  body: string;
};

export type Moon = {
  id: string;
  url: string;
  files: File['key'][];
  width?: React.CSSProperties['width'];
  height?: React.CSSProperties['height'];
  data: Record<string, any>;
  debug?: boolean;
};

export type Planet = {
  id: string;
  small: Moon & { active: boolean };
  medium: Moon & { active: boolean };
  large: Moon & {
    actions: {
      active: boolean;
      reset: boolean;
      submit: boolean;
    };
  };
};
