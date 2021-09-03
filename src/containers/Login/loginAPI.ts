export function fakeSubmit(user: string, pwd: string) {
    return new Promise<{ token: string }>((resolve, reject) =>
      setTimeout(() => user && pwd ? resolve({ token: "fsdfsdfdsfdsf" }) : reject("Missing Data"), 1200)
    );
  }
  