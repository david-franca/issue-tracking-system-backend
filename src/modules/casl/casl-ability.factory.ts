import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { PrismaAbility, Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { Issue, User } from '@prisma/client';

import { Action } from './actions.enum';

export type AppAbility = PrismaAbility<
  [string, Subjects<{ User: User; Issue: Issue }>]
>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const AppAbility = PrismaAbility as AbilityClass<AppAbility>;
    const { can, build, cannot } = new AbilityBuilder(AppAbility);
    if (user.role === 'MASTER') {
      can(Action.Manage, ['Issue', 'User']);
    }
    if (user.role === 'DEVELOPER') {
      can([Action.Update], 'Issue');
    }
    if (user.role === 'TESTER') {
      can([Action.Create], 'Issue');
    }
    cannot(Action.Delete, ['Issue', 'User']).because(
      'Only Scrum Masters can delete registers',
    );
    can(Action.Read, ['User', 'Issue']);

    return build({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      detectSubjectType: (type) =>
        type.constructor as unknown as ExtractSubjectType<
          Subjects<{ User: User; Issue: Issue }>
        >,
    });
  }
}
