import { Request } from 'express';

export class Issue {

  error_source: string; // i.e. 'crowfall.wiki', source should correspond to where the error is coming from
  error_user: string; // user string/id of person who found error; use logged in info if user is logged in!
  error_ip: string; // attempt to grab the IP of person submitting an error if done anonymously/for rate limiting
  error_message: string; // users can submit brief message if they chose to (and interface allows it)
  error_date: Date; // "now"
  data_type: string; // ('discipline' or 'power' or 'class' or 'recipe' or 'tradeskill', etc.)
  data_id: string; // id of the data

  static fromDTO(obj: any, req: Request): Issue {

    // assert
    if(!obj.data_type) throw new Error('No data_type in issue!');
    if(!obj.data_id) throw new Error('No data_id in issue!');
    if(typeof obj.data_type !== 'string') throw new Error('Malformed data_type in issue! Should be a string.');
    if(typeof obj.data_id !== 'string') throw new Error('Malformed data_id in issue! Should be a string.');

    const i = new Issue();
    i.error_source = typeof obj.error_source === 'string' ? obj.error_source : '';
    i.error_user = typeof obj.error_user === 'string' ? obj.error_suer : '';
    i.error_ip = req.ip;
    i.error_message = typeof obj.error_message === 'string' ? obj.error_message : '';
    i.error_date = new Date();
    i.data_type = obj.data_type;
    i.data_id = obj.data_id;
    return i;
  }

  static fromDBO(obj: any): Issue {
    const i = new Issue();
    i.error_source = obj.error_source || '';
    i.error_user = obj.error_user || '';
    i.error_ip = obj.error_ip || '';
    i.error_message = obj.error_message || '';
    i.error_date = new Date(obj.error_date);
    i.data_type = obj.data_type || '';
    i.data_id = obj.data_id || '';
    return i;
  }

  constructor(issue?: Issue) {
    if(issue != null) {
      this.error_source = issue.error_source || '';
      this.error_user = issue.error_user || '';
      this.error_ip = issue.error_ip || '';
      this.error_message = issue.error_message || '';
      this.error_date = new Date(issue.error_date);
      this.data_type = issue.data_type || '';
      this.data_id = issue.data_id || '';
    } else {
      this.error_source = '';
      this.error_user = '';
      this.error_ip = '';
      this.error_message = '';
      this.error_date = new Date();
      this.data_type = '';
      this.data_id = '';
    }
  }

  toDTO(): any {
    return {
      error_source: this.error_source,
      error_user: this.error_user,
      error_ip: this.error_ip,
      error_message: this.error_message,
      error_date: this.error_date,
      data_type: this.data_type,
      data_id: this.data_id,
    };
  }

  toDBO(): any {
    return this.toDTO();
  }
}
