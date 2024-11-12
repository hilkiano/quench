type JsonResponse<T> = {
  status: boolean;
  message: string;
  data: T;
  trace: any;
  code: number;
};

type Userdata = {
  user: User;
  token_expired_at: Date | string;
};

type SettingItem = {
  label: string;
  show: boolean;
  items: {
    title: string;
    description?: string;
    icon: React.ReactNode;
    handler: React.ReactNode;
  }[];
};

type ListResult<T> = {
  total: number;
  prev_page: string | null;
  next_page: string | null;
  rows: T[];
  page_count: number;
  page: number;
};
