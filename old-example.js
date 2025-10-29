import { ZKPassport } from "@zkpassport/sdk";

// Initialize ZKPassport with your domain
const zkPassport = new ZKPassport("your-domain.com");

// Example 1: Basic age verification (18 or older)
async function verifyAdultAge() {
  const { url, onResult } = await zkPassport
    .createRequest({
      name: "ZKPassport Age Verification",
      logo: "https://your-domain.com/logo.png",
      purpose: "Verify user is 18 or older",
      scope: "adult"
    })
    .gte("age", 18)
    .done();

  console.log("Verification URL:", url);

  // Handle the verification result
  onResult((result) => {
    if (result.verified) {
      console.log("Age verification successful!");
      console.log("Proof data:", result.result);
    } else {
      console.log("Age verification failed.");
    }
  });
}

// Example 2: Age range verification (between 21 and 65)
async function verifyAgeRange() {
  const { url, onResult } = await zkPassport
    .createRequest({
      name: "ZKPassport Age Range Verification",
      logo: "https://your-domain.com/logo.png",
      purpose: "Verify user age is between 21 and 65",
      scope: "adult"
    })
    .range("age", 21, 65)
    .done();

  console.log("Verification URL:", url);

  onResult((result) => {
    if (result.verified) {
      console.log("Age range verification successful!");
      console.log("User is between 21 and 65 years old");
    } else {
      console.log("Age range verification failed.");
    }
  });
}

// Example 3: Young adult verification (18-25)
async function verifyYoungAdult() {
  const { url, onResult } = await zkPassport
    .createRequest({
      name: "ZKPassport Young Adult Verification",
      logo: "https://your-domain.com/logo.png",
      purpose: "Verify user is a young adult (18-25)",
      scope: "young-adult"
    })
    .gte("age", 18)
    .lte("age", 25)
    .done();

  console.log("Verification URL:", url);

  onResult((result) => {
    if (result.verified) {
      console.log("Young adult verification successful!");
      console.log("User is between 18 and 25 years old");
    } else {
      console.log("Young adult verification failed.");
    }
  });
}

// Run examples
console.log("=== ZKPassport Age Verification Examples ===\n");

console.log("Example 1: Adult verification (18+)");
verifyAdultAge();

console.log("\nExample 2: Age range verification (21-65)");
verifyAgeRange();

console.log("\nExample 3: Young adult verification (18-25)");
verifyYoungAdult();
