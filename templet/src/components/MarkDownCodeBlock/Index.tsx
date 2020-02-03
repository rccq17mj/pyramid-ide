import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNightEighties } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface IProps  {
  value: any;
}

class CodeBlock extends React.PureComponent<IProps> {
  render() {
    const { value } = this.props;

    return (
      <SyntaxHighlighter language="" style={tomorrowNightEighties}>
        {value}
      </SyntaxHighlighter>
    );
  }
}

export default CodeBlock;
