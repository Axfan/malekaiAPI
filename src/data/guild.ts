import { IDataObject } from './interfaces';

import { Env } from '../env';

interface ACE_custom_field {
  display: string,
  immutable: boolean,
  key: string,
  locked: boolean,
  user_writable: boolean,
  value: object
}

export class Guild implements IDataObject {

  static get data_type(): string { return 'guild'; }
  data_type = Guild.data_type;

  id: string;
  name: string;
  custom_fields: ACE_custom_field[];
  date_created: Date;
  date_updated: Date;
  days_of_week: number[];
  description: string;
  display_name: string;
  guild_id: string;
  guild_leader: string;
  member_count: string;
  motd: string;
  parent_guild_id: string;
  playtime: number[];
  previous_name: string;
  recent_member_count: string;
  recruiting: boolean;
  status: string;
  tags: string[];
  type: string;
  visible: boolean;
  website_url: string;

  static fromDTO(obj: any): Guild {
    if(obj.data_type !== this.data_type && obj.data_type) throw new Error(`Datatype is not "${this.data_type}"!`);
    const g = new Guild();

    g.id = obj.id || '';
    g.name = obj.name || '';
    g.custom_fields = obj.custom_fields instanceof Array ? obj.custom_fields.map(a => { return {  display: a.display, immutable: a.immutable, key: a.key, locked: a.locked, user_writable: a.user_writable, value: a.value}; }) : [];
    g.date_created = new Date(obj.date_created);
    g.date_updated = new Date(obj.date_updated);
    g.days_of_week = obj.days_of_week || [];
    g.description = obj.description || '';
    g.display_name = obj.display_name || '';
    g.guild_id = obj.guild_id || '';
    g.guild_leader = obj.guild_leader || '';
    g.member_count = obj.member_count || '';
    g.motd = obj.motd || '';
    g.parent_guild_id = obj.parent_guild_id || '';
    g.playtime = obj.playtime || [];
    g.previous_name = obj.previous_name || '';
    g.recent_member_count = obj.recent_member_count || '';
    g.recruiting = obj.recruiting;
    g.status = obj.status || '';
    g.tags = obj.tags instanceof Array ? obj.tags.slice() : [];
    g.type = obj.type || '';
    g.visible = obj.visible;
    g.website_url = obj.website_url || '';
    return g;
  }

  static fromDBO(obj: any): Guild {
    return this.fromDTO(obj);
  }

  constructor(guild?: Guild) {
    if(guild != null) {

      this.id = guild.id || '';
      this.name = guild.name || '';
      this.custom_fields = guild.custom_fields instanceof Array ? guild.custom_fields.map(a => { return {  display: a.display, immutable: a.immutable, key: a.key, locked: a.locked, user_writable: a.user_writable, value: a.value}; }) : [];
      this.date_created = new Date(guild.date_created);
      this.date_updated = new Date(guild.date_updated);
      this.days_of_week = guild.days_of_week || [];
      this.description = guild.description || '';
      this.display_name = guild.display_name || '';
      this.guild_id = guild.guild_id || '';
      this.guild_leader = guild.guild_leader || '';
      this.member_count = guild.member_count || '';
      this.motd = guild.motd || '';
      this.parent_guild_id = guild.parent_guild_id || '';
      this.playtime = guild.playtime || [];
      this.previous_name = guild.previous_name || '';
      this.recent_member_count = guild.recent_member_count || '';
      this.recruiting = guild.recruiting;
      this.status = guild.status || '';
      this.tags = guild.tags instanceof Array ? guild.tags.slice() : [];
      this.type = guild.type || '';
      this.visible = guild.visible;
      this.website_url = guild.website_url || '';

     } else {

      this.id = '';
      this.name = '';
      this.custom_fields = [];
      this.date_created = new Date();
      this.date_updated = new Date();
      this.days_of_week = [];
      this.description = '';
      this.display_name = '';
      this.guild_id = '';
      this.guild_leader = '';
      this.member_count = '';
      this.motd = '';
      this.parent_guild_id = '';
      this.playtime = [];
      this.previous_name = '';
      this.recent_member_count = '';
      this.recruiting = false;
      this.status = '';
      this.tags = [];
      this.type = '';
      this.visible = false;
      this.website_url = '';

    }
  }

  toDTO(): any {
    return {
      data_type: this.data_type,
      id: this.id,
      name: this.name,
      custom_fields: this.custom_fields.map(a => Object.assign({}, a)),
      date_created: new Date(this.date_created),
      date_updated: new Date(this.date_updated),
      days_of_week: this.days_of_week,
      description: this.description,
      display_name: this.display_name,
      guild_id: this.guild_id,
      guild_leader: this.guild_leader,
      member_count: this.member_count,
      motd: this.motd,
      parent_guild_id: this.parent_guild_id,
      playtime: this.playtime,
      previous_name: this.previous_name,
      recent_member_count: this.recent_member_count,
      recruiting: this.recruiting,
      status: this.status,
      tags: this.tags.slice(),
      type: this.type,
      visible: this.visible,
      website_url: this.website_url
    };
  }

  toDBO(): any {
    return this.toDTO();
  }
}
