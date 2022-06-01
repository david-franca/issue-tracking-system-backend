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
    const { can, build } = new AbilityBuilder(AppAbility);
    if (user.role === 'MASTER') {
      can(Action.Manage, 'Issue');
    }
    if (user.role === 'DEVELOPER') {
      can([Action.Update, Action.Read], 'Issue');
    }
    if (user.role === 'TESTER') {
      can([Action.Create, Action.Read], 'Issue');
    }

    return build();
  }
}
