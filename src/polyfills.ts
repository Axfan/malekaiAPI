export const atob = function(str: string): string {
  return new Buffer(str, 'base64').toString('binary');
}

export const btoa = function(str: string): string {
  return new Buffer(str, 'binary').toString('base64');
};

