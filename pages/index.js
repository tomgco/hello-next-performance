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

function getTable() {
  const table = []
  for (let i = 0; i < 1e4; i++) {
    table.push(`Welcome to row ${i}`)
  }
  return table
}

const table = getTable()

Index.getInitialProps = async function() {
  const data = [ Date.now() ]

  const factor = Date.now() / 10000 % 1 > 0.5 ? 1000 : 10000

  return {
    time: data,
    table: table
  }
}

export default Index
