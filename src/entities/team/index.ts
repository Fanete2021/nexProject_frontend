import { Team, TeamSchema } from './model/types/team.ts';
import { TeamInfo } from './model/types/teamInfo.ts';
import { TeamMember } from './model/types/teamMember.ts';
import { TeamRoles } from './model/types/teamRoles.ts';
import { TeamTag } from './model/types/teamTag.ts';
import { teamReducer, teamActions } from './model/slice/teamSlice.ts';
import { getTeamData } from '@/entities/team/model/selectors/getTeamData.ts';
import { getTeamIsLoading } from '@/entities/team/model/selectors/getTeamIsLoading.ts';
import { addMembersToTeam } from './model/service/addMembersToTeam.ts';
import { createTeam } from './model/service/createTeam.ts';
import { deleteMemberFromTeam } from './model/service/deleteMemberFromTeam.ts';
import { fetchMyTeams } from './model/service/fetchMyTeams.ts';
import { fetchTeamInfo } from './model/service/fetchTeamInfo.ts';
import { getMyRole } from './libs/utils/getMyRole.ts';
import { isAdmin } from './libs/utils/isAdmin.ts';
import { editRoleInTeam } from './model/service/editRoleInTeam.ts';
import { isOwner } from './libs/utils/isOwner.ts';
import { editTeam } from './model/service/editTeam.ts';
import { isTeamNameValid, isTeamTagValid, isTeamDescriptionValid } from './libs/utils/validation.ts';
import { deleteTeam } from './model/service/deleteTeam.ts';

export type {
  Team, 
  TeamSchema,
  TeamInfo,
  TeamMember,
  TeamTag
};

export {
  teamReducer,
  teamActions,

  getTeamData,
  getTeamIsLoading,

  addMembersToTeam,
  createTeam,
  deleteMemberFromTeam,
  fetchMyTeams,
  fetchTeamInfo,
  editRoleInTeam,
  editTeam,
  deleteTeam,

  getMyRole as getMyRoleInTeam,
  isAdmin as isAdminInTeam,
  isOwner as isOwnerInTeam,

  TeamRoles,

  isTeamNameValid,
  isTeamTagValid,
  isTeamDescriptionValid
};
