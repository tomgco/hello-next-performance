const Index = (props) => (
  <div>
    <p>Hello Next.js
    {props.time.map(date => (
      <b> {date.toString()} </b>
    ))}
    </p>
    {props.table.map(row => (
      <tr> oh my {row}</tr>
    ))}
  </div>
)

Index.getInitialProps = async function() {
  const data = [ Date.now() ]
  const table = []

  const factor = Date.now() / 10000 % 1 > 0.5 ? 1000 : 10000

  for (let i = 0; i < 1e6; i++) {
    table.push(`Welcome to row ${i}`)
  }

  return {
    time: data,
    table: table
  }
}

export default Index
