const crypto = require('crypto');
const util = require('util');

const Index = (props) => (
  <div>
    <p>Hello Next.js
    {props.time.map(date => (
      <b> {date.toString()} </b>
    ))}
    with generated hash {props.hash}
    </p>
  </div>
)

const pbkdf2 = util.promisify(crypto.pbkdf2);

Index.getInitialProps = async function() {
  const data = [ Date.now() ]

  const factor = Date.now() / 10000 % 1 > 0.5 ? 1000 : 10000
  const secret = await pbkdf2('secret', 'salt', factor, 64, 'sha512')

  console.log(`Show data fetched. Count: ${data.length}`)

  return {
    time: data,
    hash: secret
  }
}

export default Index
