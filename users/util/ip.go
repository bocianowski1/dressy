package util

import (
	"fmt"
	"os/exec"
	"regexp"
)

func GetIP() (*string, error) {
	cmd := exec.Command("ifconfig", "en0")
	out, err := cmd.Output()
	if err != nil {
		return nil, fmt.Errorf("could not run command: %w", err)
	}

	var ipAddr string
	re := regexp.MustCompile(`inet (\d+\.\d+\.\d+\.\d+)`)
	matches := re.FindStringSubmatch(string(out))
	if len(matches) > 1 {
		ipAddr = matches[1]
	} else {
		return nil, fmt.Errorf("no IP address found")
	}

	return &ipAddr, nil
}
