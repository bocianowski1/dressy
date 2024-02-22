package util

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"regexp"
)

func GetIP() (*string, error) {
	var cmd *exec.Cmd
	if os.Getenv("docker") == "true" {
		log.Println("Running in Docker, using 'ip addr show' command")
		cmd = exec.Command("ip", "addr", "show", "eth0")
		out, err := cmd.Output()
		if err != nil {
			return nil, fmt.Errorf("could not run command: %w", err)
		}
		log.Println(string(out))
		localIP := "192.168.10.151"
		return &localIP, nil
	} else {
		log.Println("Assuming running locally on a Mac, using 'ifconfig'")
		cmd = exec.Command("ifconfig", "en0")
	}

	out, err := cmd.Output()
	if err != nil {
		return nil, fmt.Errorf("could not run command: %w", err)
	}
	log.Println(string(out))

	re := regexp.MustCompile(`inet (addr:)?(\d+\.\d+\.\d+\.\d+)`)
	matches := re.FindStringSubmatch(string(out))
	if len(matches) > 2 {
		ipAddr := matches[2]
		return &ipAddr, nil
	} else {
		return nil, fmt.Errorf("no IP address found")
	}
}
