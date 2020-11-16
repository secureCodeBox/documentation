---
title: Integration Tests
---
 
After you have finished the implementation, it's very much recommended to add some End-2-End Integration Tests
for your scanner to check if everything is running smoothly together. 

## Write your tests

In most cases, the simplest and most effective way
to test your scanner is by running it against a demo-app. You can also re-use one of the examples you provided. 

Let's have a look at the [ssh-scan](https://github.com/secureCodeBox/secureCodeBox/blob/main/tests/integration/scanner/ssh-scan.test.js) test to understand all the steps required:

```javascript
test(
  "ssh-scan should find a couple of findings for a dummy ssh service",
  async () => {
    const { categories, severities, count } = await scan(
      "ssh-scan-dummy-ssh", // Name of test
      "ssh-scan", // Name of scan command 
      ["-t", "dummy-ssh.demo-apps.svc"], // Parameters
      90
    );

    expect(count).toBe(4);
    expect(categories).toMatchInlineSnapshot(`
      Object {
        "SSH Policy Violation": 3,
        "SSH Service": 1,
      }
    `);
    expect(severities).toMatchInlineSnapshot(`
      Object {
        "informational": 1,
        "medium": 3,
      }
    `);
  },
  3 * 60 * 1000
);
```

At first, we start our scan function, and we feed it with a scan name, the specific scan command and a list of parameters
for the scan. Likely, you can copy them from an example. Note that you must refer to your targeted demo-app via 
`name.demp-apps.svc` if it is installed in the "demo-apps" namespace. 
**Please don't use any external websites (like google.com) in your integration tests!** 

The last parameter is a test timeout in seconds. This timeout should be lower than the general one for the jest test 
to provide us with better information in case that the test fails.

Upon finishing successfully, the scan will give us back categories, severities and a number of findings (count). 
We can then use them to create our test assertions. If you use snapshots, you don't need to copy your findings manually,
you can rather automatically update them via `npx jest --update-snapshot` (see below).

The last parameter would be the test timeout for jest in milliseconds, make sure it is high enough and 
higher than the timeout provided above.  

## Run your tests locally

Before pushing them to the repository, make sure your tests run successfully in your local cluster. 

### Setting up the resources

All of our tests run in a separate namespace called "integration-tests". 

`kubectl create namespace integration-tests`

After that, install your created scanner:

`helm -n integration-tests install your-scanner ./scanners/your-scanner`

If not yet installed, install the targeted demo-app. 

`helm -n demo-apps install targeted-app ./demo-apps/targeted-app`

Of course, you can also install other resources, if needed.

### Install The Dependencies

Go to tests directory: 
`cd tests/integration`

Then install additional dependencies via `npm ci`

### Run your tests

Finally, you can run your tests via 
`npx jest scanner/your-test.test.js`

You can also automatically update the snapshots with 
`npx jest --update-snapshot scanner/your-test.test.js`

Or you can start an interactive mode via 
`npx jest --watch scanner/your-test.test.js`

## Integrate in ci.yaml

If your tests are successful, you can eventually integrate them in the [ci workflow](https://github.com/secureCodeBox/secureCodeBox/blob/main/.github/workflows/ci.yaml#L414). Here you have to go through the
same steps as above to install all the resources in the cluster. Please make sure to stick to the conventions 
already used in the yaml file and please do not install any resources for your tests that have already been installed
or are not used in the tests.   

Thank you for helping us to provide high quality open source code! :)
