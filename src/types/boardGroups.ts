
export interface BoardGroup {
  id: string;
  name: string;
  boardIds: string[];
  created_at: string;
  updated_at: string;
}

export interface GroupedBoardViewSettings {
  groups: BoardGroup[];
  selectedGroupId: string | null;
}
