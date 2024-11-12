type User = {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
  socialite_data?: SocialiteData;
  geolocation?: GeolocationData;
  configs: {
    last_login: Date | string;
  };
  created_at: Date | string;
  updated_at: Date | string;
  deleted_at: Date | string;
  created_by: string;
  updated_by: string;
  deleted_by: string;
};

type SocialiteData = {
  id: string;
  name: string;
  user: {
    id: string;
    sub: string;
    link: string | null;
    name: string;
    email: string;
    picture: string;
    given_name: string;
    family_name: string | null;
    email_verified: boolean;
    verified_email: boolean;
  };
  email: string;
  token: string;
  avatar: string;
  nickname: string | null;
  expiresIn: number;
  attributes: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    nickname: null;
    avatar_original: string;
  };
  refreshToken: string | null;
  approvedScopes: Array<string>;
};

type GeolocationData = {
  ip: string;
  isp: string;
  city: string;
  is_eu: boolean;
  zipcode: string;
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
  district: string;
  latitude: string;
  languages: string;
  longitude: string;
  time_zone: {
    name: string;
    is_dst: boolean;
    offset: number;
    dst_end: string;
    dst_start: string;
    dst_exists: boolean;
    dst_savings: number;
    current_time: Date;
    offset_with_dst: string;
    current_time_unix: number;
  };
  geoname_id: string;
  state_code: string;
  state_prov: string;
  country_tld: string;
  calling_code: string;
  country_flag: string;
  country_name: string;
  organization: string;
  country_code2: string;
  country_code3: string;
  country_emoji: string;
  continent_code: string;
  continent_name: string;
  connection_type: string;
  country_capital: string;
  country_name_official: string;
};

type Recipe = {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  configs: any;
  created_at: Date | string;
  updated_at: Date | string;
  deleted_at: Date | string;
  created_by: string;
  updated_by: string;
  deleted_by: string;
};

type RecipeStep = {
  id: number;
  recipe_id: string;
  image_url: string;
  step: string;
  order: number;
  created_at: Date | string;
  updated_at: Date | string;
  created_by: string;
  updated_by: string;
};

type RecipeIngredient = {
  id: number;
  recipe_id: string;
  name: string;
  unit_id: number;
  image_url: string;
  created_at: Date | string;
  updated_at: Date | string;
  created_by: string;
  updated_by: string;
};
