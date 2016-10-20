const {assert} = require('chai')

describe("Either Exercises", () => {

  // Definitions
  // ====================
  const Right = x =>
  ({
    chain: f => f(x),
    map: f => Right(f(x)),
    fold: (f, g) => g(x),
    toString: () => `Right(${x})`
  })

  const Left = x =>
  ({
    chain: f => Left(x),
    map: f => Left(x),
    fold: (f, g) => f(x),
    toString: () => `Left(${x})`
  })

  const fromNullable = x =>
    x != null ? Right(x) : Left(null)

  const tryCatch = f => {
    try {
      return Right(f())
    } catch(e) {
      return Left(e)
    }
  }

  const logIt = x => {
    console.log(x)
    return x
  }

  const DB_REGEX = /postgres:\/\/([^:]+):([^@]+)@.*?\/(.+)$/i

  // Exercise: Either
  // Goal: Refactor each example using Either
  // Bonus: no curlies
  // =========================


  // Ex1: Refactor streetName to use Either instead of nested if's
  // =========================
  const street = user => {
    const address = user.address

    if(address) {
      return address.street
    } else {
      return 'no street'
    }
  }


  it("Ex1: street", () => {
    const user = { address: { street: { name: "Willow" } } }
    assert.deepEqual(street(user), {name: "Willow"})
    assert.strictEqual(street({}), "no street")
  })

  // Ex1: Refactor streetName to use Either instead of nested if's
  // =========================
  const streetName = user =>
    fromNullable(user.address)
      .map(address => address.street)
      .chain(fromNullable)
      .fold(() => 'no street', street => street.name)

  it("Ex1: streetName", () => {
    const user = { address: { street: { name: "Willow" } } }
    assert.strictEqual(streetName(user), "Willow")
    assert.strictEqual(streetName({}), "no street")
    assert.strictEqual(streetName({ address: { street: null } }), "no street")
  })


  // Ex2: Refactor parseDbUrl to return an Either instead of try/catch
  // =========================
  const parseDbUrl = cfg =>
    tryCatch(() => JSON.parse(cfg))
      .fold(() => null, c => c.url.match(DB_REGEX))

  // const parseDbUrl = cfg =>
  //   tryCatch(() => JSON.parse(cfg))
  //     .map(c => c.url)
  //     .map(url => url.match(DB_REGEX))
  //     .fold(() => null, x => x)

  it("Ex1: parseDbUrl", () => {
    const config = '{"url": "postgres://sally:muppets@localhost:5432/mydb"}'
    assert.equal(parseDbUrl(config)[1], "sally")
    assert.equal(parseDbUrl(), null)
  })



  // Ex3: Using Either and the functions above, refactor startApp
  // =========================
  const startApp = cfg =>
    fromNullable(parseDbUrl(cfg))
      .fold(() => "can't get config",
        ([_, user, password, db]) => `starting ${db}, ${user}, ${password}`
      )

  // const startApp = cfg =>
  //   fromNullable(parseDbUrl(cfg))
  //     .map(([_, user, password, db]) => `starting ${db}, ${user}, ${password}`)
  //     .fold(() => "can't get config", x => x)

  it("Ex3: startApp", () => {
    const config = '{"url": "postgres://sally:muppets@localhost:5432/mydb"}'
    assert.strictEqual(startApp(config), "starting mydb, sally, muppets")
    assert.strictEqual(startApp(), "can't get config")
  })

})
