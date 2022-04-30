export class Primitive_root{
  public n:number;
  public primitiveRootList:number[];
  isPrime(n:number) {
      // Corner cases
      if (n <= 1)
          return false;
      if (n <= 3)
          return true;

      // This is checked so that we can skip
      // middle five numbers in below loop
      if (n % 2 == 0 || n % 3 == 0)
          return false;

      for (let i = 5; i * i <= n; i = i + 6)
          if (n % i == 0 || n % (i + 2) == 0)
              return false;

      return true;
  }
  power(x:number, y:number, p:number) {
      let res = 1;
      x = x % p;
      while (y > 0) {
          if (y & 1)
              res = (res * x) % p;
          y = y >> 1; // y = y/2
          x = (x * x) % p;
      }
      return res;
  }
  findPrimefactors(s:Set<number>, n:number) {

      while (n % 2 == 0) {
          s.add(2);
          n = n / 2;
      }
      for (let i = 3; i <= Math.sqrt(n); i = i + 2) {
          while (n % i == 0) {
              s.add(i);
              n = n / i;
          }
      }
      if (n > 2)
          s.add(n);
  }
  findPrimitive(n:number) {
      let s = new Set<number>();
      let result = new Array<number>();
      let res_set = new Set<number>();
      if (this.isPrime(n) == false)
          return result;
      let phi = n - 1;
      this.findPrimefactors(s, phi);

      // Check for every number from 2 to phi
      for (let r = 2; r <= phi; r++) {
          let flag = false;
          for (let it of s) {
              if (this.power(r, phi / it, n) == 1) {
                  flag = true;
                  break;
              }
          }

          // If there was no power with value 1.
          if (flag == false)
          {
              if(res_set.has(r) === false){
                  res_set.add(r);
                  result.push(r);
              }
          }
      }
      return result;
  }
  constructor(n:number){
      this.n = n;
      this.primitiveRootList = this.findPrimitive(this.n);
  }
}

export class Elgamal extends Primitive_root
{
  public q:number; //prime number
  getRandomInteger(range:number){
      return  Math.floor((Math.random()*range));
  }
  // Primitive_root class provide list of primitive roots of q and power method which computes A^B % C.
  generateKeys():Map<string,number>{
      let alpha:number = this.getRandomInteger(this.primitiveRootList[this.getRandomInteger(this.primitiveRootList.length)]); // a random integer seleted from GF(q)
      let XA:number = this.getRandomInteger(this.q-1); //XA is random integer < q-1
      let YA:number = this.power(alpha,XA,this.q); // YA = aplha^XA % q
      let keys = new Map<string, number>();
      keys.set("private_key",XA);
      keys.set("q",this.q);
      keys.set("alpha",alpha);
      keys.set("YA",YA);
      return keys; // public key is {q,alpha,YA}
  }
  encrypt(keys:Map<string,number>,message:number):Map<string,number>{
      let q:number = keys.get('q') as number; //Extracting q component of public key
      let alpha:number = keys.get('alpha') as number; //Extracting alpha component of public key
      let YA:number = keys.get('YA') as number; //Extracting YA component of public key
      let k = this.getRandomInteger(q);  // random integer < q
      let K:number = this.power(YA,k,q);
      let C1:number = this.power(alpha,k,q); // ciphertext C1
      let C2:number = K*message; // CipherText C2
      let ciphertext = new Map<string, number>();
      ciphertext.set("C1",C1);
      ciphertext.set("C2",C2);
      return ciphertext; // ciphertext {C1,C2}
  }
  decrypt(ciphertext:Map<string,number>,private_key:number):number{
      let C1:number = ciphertext.get('C1') as number;// Extractin ciphertext C1
      let C2:number = ciphertext.get('C2') as number;// Extracting ciphertext C2
      let K:number = this.power(C1,private_key,this.q);
      let K_invierse:number = this.power(K,this.q -2,this.q);
      return C2*K_invierse % this.q; //decrypting cipher text using the private key


  }
  constructor(q:number){
      super(q);
      this.q = q;
  }
}
