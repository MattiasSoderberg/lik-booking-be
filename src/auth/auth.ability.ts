import { AbilityBuilder, PureAbility } from '@casl/ability';
import { PrismaQuery, Subjects, createPrismaAbility } from '@casl/prisma';
import { Client, Event, User } from '@prisma/client';

export type AppSubjects = Subjects<{
  User: User;
  Client: Client;
  Event: Event;
}>;

export type AppAbility = PureAbility<
  [string, 'all' | AppSubjects],
  PrismaQuery
>;

export type Rule = {
  [key: string]: {
    actions: string[];
    conditions?: object;
  };
};

export class AuthAbility {
  async createAbility(user) {
    const ability = createPrismaAbility(await this.defineRules(user));
    return ability;
  }

  private async defineRules(user) {
    const { can, rules } = new AbilityBuilder<AppAbility>(createPrismaAbility);
    const userRules: Rule = {};

    user.role.permissions.forEach((permission) => {
      if (!userRules[permission.subject]) {
        userRules[permission.subject] = { actions: [] };
      }
      userRules[permission.subject].actions.push(permission.action);
      if (permission.conditions) {
        userRules[permission.subject]['conditions'] = this.parseCondition(
          permission.conditions,
          user.uuid,
        );
      }
    });

    Object.entries(userRules).forEach((rule) =>
      can(rule[1].actions, rule[0] as any, rule[1]?.conditions),
    );

    return rules;
  }

  private parseCondition(condition, uuid) {
    const conditionToString = JSON.stringify(condition);
    return JSON.parse(conditionToString, (key, value) => {
      if (typeof value === 'string' && value[0] === '$') {
        return key === 'uuid' ? uuid : { uuid };
      }
      return { ...value };
    });
  }
}
