import { SetMetadata } from '@nestjs/common';
import { Roles } from '../../enums/enums';

export const Role = (...roles: Roles[]) => SetMetadata('roles', roles);