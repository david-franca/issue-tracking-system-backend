import { AbilityBuilder, AbilityClass } from '@casl/ability';
import { PrismaAbility, Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { Issue, User } from '@prisma/client';

import { Action } from './actions.enum';

export type AppAbility = PrismaAbility<
  [
    string,
    (
      | Subjects<{
          User: User;
          Issue: Issue;
        }>
      | 'all'
    ),
  ]
>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const AppAbility = PrismaAbility as AbilityClass<AppAbility>;
    const { can, cannot, build } = new AbilityBuilder(AppAbility);
    if (user.role === 'MASTER') {
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, 'all');
    }

    return build();
  }
}
