import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { createRecords } from '../utils/createRecords';

const tld = '.charaktor';
const CONTRACT_ADDRESS = '0x81163b5ffa646067B5f7575B344c75332F35359a';

export const Names: React.FunctionComponent<any> = (names: string[], editRecord) => {
  const [mints, setMints] = useState([])
  const recordsQuery = createRecords(names)
  const [accountQuery] = useAccount();

  if (accountQuery.data?.address && recordsQuery.length > 0) {
    return (
      <div className="mint-container">
        <p className="subtitle"> Recently minted domains!</p>
        <div className="mint-list">
          {mints.map((mint, index) => {
            return (
              <div className="mint-item" key={index}>
                <div className="mint-row">
                  <a
                    className="link"
                    href={`https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${mint.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p className="underlined">
                      {' '}
                      {mint.name}
                      {tld}{' '}
                    </p>
                  </a>
                  {/* If mint.owner is currentAccount, add an "edit" button*/}
                  {mint.owner.toLowerCase() ===
                  accountQuery.data?.address.toLowerCase() ? (
                    <button
                      className="edit-button"
                      onClick={() => editRecord(mint.name)}
                    >
                      <img
                        className="edit-icon"
                        src="https://img.icons8.com/metro/26/000000/pencil.png"
                        alt="Edit button"
                      />
                    </button>
                  ) : null}
                </div>
                <p> {mint.record} </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}