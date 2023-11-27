// Icon Type
type IconType = React.ForwardRefExoticComponent<
  Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    title?: string | undefined;
    titleId?: string | undefined;
  } & React.RefAttributes<SVGSVGElement>
>;

// Tab Type
export interface Tab {
  name: string;
  href: string;
  icon: IconType;
  current: boolean;
}

// Team Type
export interface Team {
  id: number;
  name: string;
  href: string;
  initial: string;
  current: boolean;
}