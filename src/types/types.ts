// {
//     link: '/books/view/hpnTChAu9Fk7yrkeNEAP',
//     id: 'hpnTChAu9Fk7yrkeNEAP',
//     displayName: 'Parth Patel',
//     imageURL: 'uploads/images/1718380930267-Screenshot (1).png',
//     price: 29921,
//     photoURL:
//       'https://lh3.googleusercontent.com/a/ACg8ocJs-8SY4dbBDjud-WOpGa7OM71CuWOOiGrxi86U31WQP-KpUYg=s96-c',
//     userEmail: 'patelparth31795@gmail.com',
//     name: 'dssa',
//     userID: 'vMmXENBWJnRw8m1porohyNySNZo2',
//     isbn: 2616,
//     key: undefined
//   }

export interface BookType {
  link: string;
  id: string;
  displayName: string;
  imageURL: string;
  price: number;
  photoURL: string;
  userEmail: string;
  name: string;
  userID: string;
  isbn: number;
  key?: any;
  editlink?: string | undefined;
}

// {
//   userID: '6dKasglzLiOab2lz1z4CG1kIXww1',
//   price: 122,
//   displayName: 'Parth Dangroshiya',
//   isbn: 26621,
//   photoURL:
//     'https://lh3.googleusercontent.com/a/ACg8ocKeaP-0hkZ3NNK03H5YXR6tALNtknvkcRCBB1FrSk5Tn99LkA=s96-c',
//   name: 'ssds',
//   userEmail: 'parth.dangroshiya@green-apex.com',
//   imageURL: 'uploads/images/1718384969574-Screenshot 2024-06-13 004525.png'
// }

export interface singleBookType {
  userID: string;
  price: number;
  displayName: string;
  isbn: number;
  photoURL: string;
  name: string;
  userEmail: string;
  imageURL: string;
}
